import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import axios from 'axios'

import sql from 'mssql'
import db from './data/db'
import webConfigParser from './config/webConfigParser'

export default async (on, config) => {

    // Define named seeds so we can pass in short seed names that can
    // run multiple sql scripts
    const namedSeeds = {
        baseline: [ 'permissions', 'teststore' ]
    }

    // Load web config
    const webConfigPath = path.join(config.env.wwwRoot, 'Web.config');
    const webConfig = await webConfigParser.parse(webConfigPath);
    const connectionString = webConfig.connectionStrings.umbracoDbDSN.connectionString;

    async function seedApp ( seeds ) 
    {
        // Ensure seeds is an array
        if (!Array.isArray(seeds))
            seeds = [seeds];

        try 
        {
            // Execute the SQL script
            const conn = await db.getConnection(connectionString);
            const trans = new sql.Transaction();
            await promisify(trans.begin).call(trans);

            // Convert named seeds
            for (var i = seeds.length; i >= 0; i--) {
                var namedSeed = namedSeeds[seeds[i]];
                if (namedSeed) {
                    seeds.splice(i, 1, ...namedSeed);
                }
            }

            // Loop through the scripts to run
            for (const seed of seeds) 
            {
                // Load SQL script
                const scriptPath = path.join(config.env.sqlRoot, `${seed}.sql`);
                const query = fs.readFileSync(scriptPath, { encoding: 'UTF-8' });

                let req = await conn.request(trans);
                await req.query(query);
            }

            await trans.commit();
            return true;
        }
        catch (err) 
        {
            console.log(err);
            return false;
        }
    }

    async function restartApp() 
    {
        try 
        {
            // Touch the web.config to force a restart
            const time = new Date();
            await fs.utimes(webConfigPath, time, time);
            return true;
        }
        catch (err) 
        {
            console.log(err);
            return false;
        }
    }

    async function clearAppCaches() 
    {
        try 
        {
            // Check cache helper api controller is present
            const appCodeDir = path.join(config.env.wwwRoot, "App_Code");
            const cacheHelperApiControllerPath = path.join(appCodeDir, "CacheHelperApiController.cs");

            if (!fs.existsSync(cacheHelperApiControllerPath)) {

                if (!fs.existsSync(appCodeDir)) {
                    fs.mkdirSync(appCodeDir);
                }

                var file = fs.createWriteStream(cacheHelperApiControllerPath);

                await axios({
                    method: "get",
                    url: "https://gist.githubusercontent.com/mattbrailsford/32e814e989c47ffaef8a3e92e67a0246/raw/CacheHelperApiController.cs",
                    responseType: "stream"
                }).then(function (response) {
                    response.data.pipe(file);
                });
                
            }

            await axios.get(config.baseUrl + "/umbraco/api/CacheHelperApi/ClearCaches");
            return true;
        }
        catch (err) 
        {
            console.log(err);
            return false;
        }
    }

    on('task', {
        'app:seed'(seedType) {
            return seedApp(seedType);
        },
        'app:restart'() {
            return restartApp();
        },
        'app:clearCache'() {
            return clearAppCaches();
        }
    })

}