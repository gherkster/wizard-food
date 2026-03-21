# OpenAPI spec

Get the Directus OpenAPI spec from /directus/server/specs/oas

# Required vs optional fields

A property is marked as required in the generated Directus schema when all the following are true
* Not nullable
* No default value
* Not a generated field

https://github.com/directus/directus/pull/24123
