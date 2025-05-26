--[[
      OBS Studio Lua script : Controle os interruptores do Painelzinho com teclas de atalho
      Author: Zer0G0l
      Version: 0.2
      Released: 26-05-2025
--]]

local obs = obslua
local debug = false
local hk = {}
local hotkeyStates = {}  -- Armazena o estado ON/OFF de cada hotkey

-- Gerar nomes legíveis dos hotkeys para o OBS
local hotkeyLabels = {
    A_SWITCH_0_main = "Main Switch",
    A_SWITCH_1 = "Lower Third Switch #1",
    A_SWITCH_2 = "Lower Third Switch #2",
    A_SWITCH_3 = "Lower Third Switch #3",
    A_SWITCH_4 = "Lower Third Switch #4"
}

-- Gera automaticamente os hotkeys LT1_SLT01 até LT4_SLT10
for alt = 1, 4 do
    for slot = 1, 10 do
        local key = string.format("LT%d_SLT%02d", alt, slot)
        local label = string.format("Load Slot #%d on LT#%d", slot, alt)
        hotkeyLabels[key] = label
    end
end

-- Caminho do script
function script_path()
    local info = debug.getinfo(1, 'S')
    return info.source:match("@?(.*[\\/])")
end

-- Atualiza o arquivo JS com os estados das hotkeys
function update_hotkeys_js()
    local output = assert(io.open(script_path() .. '../common/js/hotkeys.js', "w"))

    for key, _ in pairs(hotkeyLabels) do
        local varName = "hotkey" .. key:gsub("_", "")  -- Formato: hotkeyA_SWITCH_1
        local value = hotkeyStates[key] or 0
        output:write(varName .. " = " .. value .. ";\n")
    end

    output:close()
end

-- Lógica quando uma hotkey é pressionada
local function onHotKey(action)
    if debug then obs.script_log(obs.LOG_INFO, string.format("Hotkey: %s", action)) end

    if hotkeyStates[action] == nil then
        hotkeyStates[action] = 0
    end

    hotkeyStates[action] = (hotkeyStates[action] == 0) and 1 or 0
    update_hotkeys_js()
end

-- Ordena chaves alfanumericamente
local function pairsByKeys(t, f)
    local a = {}
    for n in pairs(t) do table.insert(a, n) end
    table.sort(a, f)
    local i = 0
    local iter = function()
        i = i + 1
        if a[i] == nil then return nil
        else return a[i], t[a[i]] end
    end
    return iter
end

-- Carregado ao iniciar o script
function script_load(settings)
    for name, label in pairsByKeys(hotkeyLabels) do
        hk[name] = obs.obs_hotkey_register_frontend(name, label, function(pressed)
            if pressed then onHotKey(name) end
        end)
        local hotkeyArray = obs.obs_data_get_array(settings, name)
        obs.obs_hotkey_load(hk[name], hotkeyArray)
        obs.obs_data_array_release(hotkeyArray)

        -- Inicializa estados
        hotkeyStates[name] = 0
    end

    update_hotkeys_js()
end

function script_save(settings)
    for k, _ in pairs(hotkeyLabels) do
        local hotkeyArray = obs.obs_hotkey_save(hk[k])
        obs.obs_data_set_array(settings, k, hotkeyArray)
        obs.obs_data_array_release(hotkeyArray)
    end
end

function script_unload()
end

function script_update(settings)
    debug = obs.obs_data_get_bool(settings, "debug")
end

function script_description()
    return "Control the switches of the lower thirds with hotkeys"
end

function script_properties()
    local props = obs.obs_properties_create()
    obs.obs_properties_add_bool(props, "debug", "Enable debug output")
    return props
end

function script_defaults(settings)
    obs.obs_data_set_default_bool(settings, "debug", false)
end
