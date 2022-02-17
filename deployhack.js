function serverthreads(server, scriptram){
    let fr = server.maxRam - server.ramUsed
    let t = Math.floor(fr/scriptram)
    return t
}
/** @param {NS} ns
*  @param {String} server Server Name
*  @param {Set} pset */

async function servlistbuilder(ns, server, pset){
let recurseset = new Set()
ns.tprintf("Found Server %s...", server)

let conn = ns.scan(server)
pset.add(server)


for(let i = 0; i < conn.length; i++){
    await ns.sleep(1)	
    //console.log("pset: %o", pset)
    if(!(pset.has(conn[i]))){
        //ns.tprintf("Recursing %s...", server)
        await servlistbuilder(ns, conn[i], pset) 
    }		

            
}
console.log(pset)
return pset	
}




/** @param {NS} ns **/
export async function main(ns) {
let scriptName = "hack.js"
let breakscript = "break.js"
let hservers = ["home"]
let servers = ns.scan("home")
let scriptServ = ns.getServer("home")
let scriptcost = ns.getScriptRam(scriptName)
let homeram = scriptServ.maxRam - scriptServ.ramUsed
let ramneeded = scriptcost * servers.length
let serverset = new Set()
let sset = await servlistbuilder(ns, "home",serverset)
let killonall = false
let killchoice = false

if(ramneeded > homeram){
ns.tprintf("Insufficient Ram available for deploying %s on %s servers, Needed: %fGB, Available: %fGB", scriptName, servers.length, ns.nFormat(ramneeded, "0.00"), ns.nFormat(homeram, "0.00"))
ns.exit()
}
if(!ns.args[0]){
ns.tprint("No target specified, use deployhack.js <target>")
ns.exit()
}
console.log(sset)
for(let serverName of sset){	
if(serverName == scriptServ.hostname){
    continue
}
let sr = ns.getServer(serverName)
if(!(sr.hasAdminRights)){
    ns.tprintf("Root access not found on %s.", serverName)
    
    if(ns.getServerRequiredHackingLevel(serverName) > ns.getHackingLevel()){
        ns.tprintf("Required Hacking Level too high, skipping.")
        continue
    }
    else{
        ns.tprint("Hacking level requirement met, attempting break.")
        ns.exec(breakscript, scriptServ.hostname, 1, serverName)
    }
    await ns.sleep(1000)
    if(!sr.hasAdminRights){
        ns.tprintf("Break failed on %s, skipping", serverName)
        continue
    }
}
let t = serverthreads(ns.getServer(serverName), ns.getScriptRam(scriptName))
let res = false
if(t == 0){
    if(killonall){
        ns.tprintf("Killing processes on %s", serverName)
        ns.killall(serverName)
        t = serverthreads(ns.getServer(serverName), ns.getScriptRam(scriptName))
        if(t == 0){
            ns.tprintf("Insufficient total ram on %s (%sGB) for any threads of %s (%sGB)", serverName, ns.getServer(serverName).maxRam, scriptName, ns.getScriptRam(scriptName) )
            continue
        }

    }
    else
    {
        res = await ns.prompt("Not enough free ram on "+ serverName + "to execute " + scriptName + ", kill existing processes?")
        if(res){
            ns.tprintf("Killing processes on %s", serverName)
            ns.killall(serverName)
            t = serverthreads(ns.getServer(serverName), ns.getScriptRam(scriptName))
            if(!killchoice){
                killonall = await ns.prompt("Kill Processes on all servers?")
                killchoice = true
            }
            if(t == 0){
                ns.tprintf("Insufficient total ram on %s (%sGB) for any threads of %s (%sGB)", serverName, ns.getServer(serverName).maxRam, scriptName, ns.getScriptRam(scriptName) )
                continue
            }

        }
    }
}
await ns.scp(scriptName, serverName)
ns.tprintf("Executing %s on %s againsts %s with %s threads", scriptName, serverName, ns.args[0], t)
if(!ns.exec(scriptName,serverName,t,ns.args[0])){
    ns.tprintf("Failed to execute %s on %s against %s",scriptName, serverName, ns.args[0])
    ns.exit()
}
}

}