import fs from 'fs-extra'
import xml2js from 'xml2js'
import { promisify } from 'util'

export async function parse (filePath) 
{
    try 
    {
        var parser = new xml2js.Parser();
    
        let webConfig = {
            appSettings: {},
            connectionStrings: {}
        }

        const  webConfigContents = await fs.readFile(filePath);
        const  webConfigXml = await promisify(parser.parseString)(webConfigContents);

        // Get the array of app settings from the parsed web.config
        if (webConfigXml.configuration["appSettings"] && webConfigXml.configuration["appSettings"][0]) 
        {
            var appSettings = webConfigXml.configuration["appSettings"][0]['add'];

            appSettings.forEach(xmlNode => 
            {
                var xmlAttributes = xmlNode['$'];

                webConfig.appSettings[xmlAttributes.key] = xmlAttributes.value;
            });
        }

        // Get the array of connection strings from the parsed web.config
        if (webConfigXml.configuration["connectionStrings"] && webConfigXml.configuration["connectionStrings"][0]) 
        {
            var connectionStrings = webConfigXml.configuration["connectionStrings"][0]['add'];

            connectionStrings.forEach(xmlNode => 
            {
                var xmlAttributes = xmlNode['$'];

                webConfig.connectionStrings[xmlAttributes.name] = {
                    connectionString: xmlAttributes.connectionString,
                    providerName: xmlAttributes.providerName
                }
            });
        }

        return webConfig;

    } 
    catch ( err ) 
    {
        console.log( err )
    }
}

export default {
    parse
}