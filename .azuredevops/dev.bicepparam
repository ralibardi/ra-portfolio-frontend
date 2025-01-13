using './deploy.bicep'

param subscriptionId = ''
param name = ''
param location = ''
param hostingPlanName = ''
param alwaysOn = false
param ftpsState = ''
param sku = ''
param skuCode = ''
param workerSize = ''
param numberOfWorkers = ''
param nodeVersion = ''
param dnszones_ronny_dev_name = 'ronny.dev'
param certificates_alibardi_dev_ra_portfolio_name = 'alibardi.dev-ra-portfolio'
param loadtests_RA_portfolio_loadTesting_name = 'RA-portfolio-loadTesting'
param actionGroups_Application_Insights_Smart_Detection_name = 'Application Insights Smart Detection'
param workspaces_DefaultWorkspace_WUK_externalid = '/subscriptions/${subscriptionId}/resourceGroups/DefaultResourceGroup-WUK/providers/Microsoft.OperationalInsights/workspaces/DefaultWorkspace-${subscriptionId}-WUK'

