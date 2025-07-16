
fx_version 'cerulean'
game 'gta5'

author 'Lovable Dev'
description 'Advanced Organization Tablet System for ESX'
version '1.0.0'

shared_scripts {
    '@es_extended/imports.lua',
    '@ox_lib/init.lua',
    'config.lua'
}

client_scripts {
    'client/main.lua',
    'client/apps/*.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/apps/*.lua',
    'server/database.lua'
}

files {
    'web/dist/index.html',
    'web/dist/**/*'
}

ui_page 'web/dist/index.html'

dependencies {
    'es_extended',
    'oxmysql',
    'ox_inventory'
}
