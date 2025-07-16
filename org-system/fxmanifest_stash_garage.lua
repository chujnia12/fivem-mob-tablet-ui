
fx_version 'cerulean'
game 'gta5'

description 'Organization Stash & Garage System with Dynamic Capacity'
version '1.0.0'

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/stash-garage.lua'
}

dependencies {
    'es_extended',
    'oxmysql',
    'ox_inventory'
}
