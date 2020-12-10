-- Remove all permissions / user groups related to the commerce section
DELETE FROM [umbracoUser2UserGroup] WHERE [userGroupId] IN (SELECT [id] FROM [umbracoUserGroup] WHERE [userGroupAlias] = 'commerce');
DELETE FROM [umbracoUserGroup2App] WHERE [app] = 'commerce';
DELETE FROM [umbracoUserGroup] WHERE [userGroupAlias] = 'commerce';

-- Unset nullable FK's to prevent any errors
UPDATE [vendrStore] SET [defaultCountryId] = null;
UPDATE [vendrStore] SET [defaultOrderStatusId] = null;
UPDATE [vendrStore] SET [defaultTaxClassId] = null;
UPDATE [vendrStore] SET [confirmationEmailTemplateId] = null;
UPDATE [vendrStore] SET [errorEmailTemplateId] = null;
UPDATE [vendrStore] SET [giftCardActivationOrderStatusId] = null;
UPDATE [vendrStore] SET [defaultGiftCardEmailTemplateId] = null;
UPDATE [vendrStore] SET [shareStockFromStoreId] = null;
UPDATE [vendrCountry] SET [defaultCurrencyId] = null;
UPDATE [vendrCountry] SET [defaultShippingMethodId] = null;
UPDATE [vendrCountry] SET [defaultPaymentMethodId] = null;
UPDATE [vendrRegion] SET [defaultShippingMethodId] = null;
UPDATE [vendrRegion] SET [defaultPaymentMethodId] = null;
UPDATE [vendrPaymentMethod] SET [taxClassId] = null;
UPDATE [vendrShippingMethod] SET [taxClassId] = null;
UPDATE [vendrOrderLine] SET [copiedFromOrderLineId] = null;
UPDATE [vendrOrderLine] SET [parentOrderLineId] = null;
UPDATE [vendrOrderLine] SET [taxClassId] = null;
UPDATE [vendrOrder] SET [paymentMethodId] = null;
UPDATE [vendrOrder] SET [shippingMethodId] = null;
UPDATE [vendrOrder] SET [copiedFromOrderId] = null;

-- Remove Vendr match table data
DELETE FROM [vendrActivityLog];
DELETE FROM [vendrCurrencyAllowedCountry];
DELETE FROM [vendrDiscountCode];
DELETE FROM [vendrFrozenPrice];
DELETE FROM [vendrGiftCardProperty];
DELETE FROM [vendrOrderPriceAdjustment];
DELETE FROM [vendrOrderAmountAdjustment];
DELETE FROM [vendrOrderAppliedDiscountCode];
DELETE FROM [vendrOrderAppliedGiftCard];
DELETE FROM [vendrOrderLineProperty];
DELETE FROM [vendrOrderProperty];
DELETE FROM [vendrPaymentMethodAllowedCountryRegion];
DELETE FROM [vendrPaymentMethodCountryRegionPrice];
DELETE FROM [vendrPaymentMethodPaymentProviderSetting];
DELETE FROM [vendrShippingMethodAllowedCountryRegion];
DELETE FROM [vendrShippingMethodCountryRegionPrice];
DELETE FROM [vendrStoreAllowedUser];
DELETE FROM [vendrStoreAllowedUserRole];
DELETE FROM [vendrTaxClassCountryRegionTaxRate];

-- Remove Vendr entity table data
DELETE FROM [vendrOrderLine];
DELETE FROM [vendrOrder];
DELETE FROM [vendrRegion];
DELETE FROM [vendrCountry];
DELETE FROM [vendrCurrency];
DELETE FROM [vendrOrderStatus];
DELETE FROM [vendrPaymentMethod];
DELETE FROM [vendrShippingMethod];
DELETE FROM [vendrTaxClass];
DELETE FROM [vendrEmailTemplate];
DELETE FROM [vendrDiscount];
DELETE FROM [vendrGiftCard];
DELETE FROM [vendrStock];
DELETE FROM [vendrStore];

