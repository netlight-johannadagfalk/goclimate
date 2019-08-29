/*
 * Always include all static files in output bundles so we can use them in
 * Rails views. This bundle is not intended to be referenced itself from asset
 * helpers.
 */
require.context('../images', true)
