-- Create Commerce user group
INSERT INTO [umbracoUserGroup] (userGroupAlias, userGroupName, icon, createDate, updateDate, startContentId, startMediaId) VALUES ('commerce', 'Commerce', 'icon-store', GETDATE(), GETDATE(), -1, -1);

-- Give the Commerce user group access to the commerce section
INSERT INTO [umbracoUserGroup2App] (userGroupId, app) SELECT [id], [userGroupAlias] FROM [umbracoUserGroup] WHERE [userGroupAlias] = 'commerce';

-- Assign admin to the commerce user group
INSERT INTO [umbracoUser2UserGroup] (userId, userGroupId) SELECT -1, [id] FROM [umbracoUserGroup] WHERE [userGroupAlias] = 'commerce';