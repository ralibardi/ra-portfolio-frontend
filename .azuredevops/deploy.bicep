param subscriptionId string
param name string
param location string
param hostingPlanName string
param alwaysOn bool
param ftpsState string
param sku string
param skuCode string
param workerSize string
param numberOfWorkers string
param nodeVersion string

param dnszones_ronny_dev_name string = 'ronny.dev'
param certificates_alibardi_dev_ra_portfolio_name string = 'alibardi.dev-ra-portfolio'
param loadtests_RA_portfolio_loadTesting_name string = 'RA-portfolio-loadTesting'
param actionGroups_Application_Insights_Smart_Detection_name string = 'Application Insights Smart Detection'
param workspaces_DefaultWorkspace_WUK_externalid string = '/subscriptions/${subscriptionId}/resourceGroups/DefaultResourceGroup-WUK/providers/Microsoft.OperationalInsights/workspaces/DefaultWorkspace-${subscriptionId}-WUK'

resource actionGroups_Application_Insights_Smart_Detection_name_resource 'microsoft.insights/actionGroups@2023-09-01-preview' = {
  name: actionGroups_Application_Insights_Smart_Detection_name
  location: 'Global'
  properties: {
    groupShortName: 'SmartDetect'
    enabled: true
    emailReceivers: []
    smsReceivers: []
    webhookReceivers: []
    eventHubReceivers: []
    itsmReceivers: []
    azureAppPushReceivers: []
    automationRunbookReceivers: []
    voiceReceivers: []
    logicAppReceivers: []
    azureFunctionReceivers: []
    armRoleReceivers: [
      {
        name: 'Monitoring Contributor'
        roleId: '749f88d5-cbae-40b8-bcfc-e573ddc772fa'
        useCommonAlertSchema: true
      }
      {
        name: 'Monitoring Reader'
        roleId: '43d0d8ad-25c7-4714-9337-8ba259a9fe05'
        useCommonAlertSchema: true
      }
    ]
  }
}

resource hostingPlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: skuCode
    tier: sku
    size: workerSize
    family: skuCode
    capacity: int(numberOfWorkers)
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: '${name}-app'
  location: location
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      alwaysOn: alwaysOn
      ftpsState: ftpsState
      nodeVersion: nodeVersion
      linuxFxVersion: 'NODE|${nodeVersion}'
    }
  }
}

resource name_components_resource 'microsoft.insights/components@2020-02-02' = {
  name: name
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Flow_Type: 'Redfield'
    Request_Source: 'IbizaWebAppExtensionCreate'
    RetentionInDays: 90
    WorkspaceResourceId: workspaces_DefaultWorkspace_WUK_externalid
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource loadtests_RA_portfolio_loadTesting_name_resource 'Microsoft.LoadTestService/loadtests@2022-12-01' = {
  name: loadtests_RA_portfolio_loadTesting_name
  location: 'uksouth'
  identity: {
    type: 'None'
  }
  properties: {}
}

resource dnszones_ronny_dev_name_resource 'Microsoft.Network/dnszones@2023-07-01-preview' = {
  name: dnszones_ronny_dev_name
  location: 'global'
  properties: {
    zoneType: 'Public'
  }
}

resource certificates_alibardi_dev_ra_portfolio_name_resource 'Microsoft.Web/certificates@2023-12-01' = {
  name: certificates_alibardi_dev_ra_portfolio_name
  location: location
  properties: {
    hostNames: [
      'alibardi.dev'
    ]
    canonicalName: 'alibardi.dev'
  }
}

resource name_staticSites_resource 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  sku: {
    name: sku
    tier: sku
  }
  properties: {
    repositoryUrl: 'https://github.com/ralibardi/${name}'
    branch: 'main'
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

resource name_staticSites_default 'Microsoft.Web/staticSites/basicAuth@2023-12-01' = {
  parent: name_staticSites_resource
  name: 'default'
  properties: {
    applicableEnvironmentsMode: 'SpecifiedEnvironments'
  }
}

resource name_staticSites_alibardi_dev 'Microsoft.Web/staticSites/customDomains@2023-12-01' = {
  parent: name_staticSites_resource
  name: 'alibardi.dev'
  properties: {}
}

resource name_staticSites_ronny_dev 'Microsoft.Web/staticSites/customDomains@2023-12-01' = {
  parent: name_staticSites_resource
  name: 'ronny.dev'
  properties: {}
}
