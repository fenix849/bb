/** @param {NS} ns **/
export async function main(ns) {
    var scriptName = "break.js"
    var hservers = ["home"]
    var servers = ns.scan("home")
    var scriptServ = ns.getServer("home")
    var ram = ns.getScriptRam(scriptName)
    var homeram = scriptServ.maxRam - scriptServ.ramUsed
    var ramneeded = ram * servers.length
    if(ramneeded > homeram){
        ns.tprintf("Insufficient Ram available for deploying %s on %s servers, Needed: %fGB, Available: %fGB", scriptName, servers.length, ns.nFormat(ramneeded, "0.00"), ns.nFormat(homeram, "0.00"))
        ns.exit()
    }
    for(var serverName of servers){	
        if(!ns.getServer(serverName).purchasedByPlayer){		
            if(!ns.exec(scriptName,"home",1,serverName)){
                ns.tprintf("Failed to execute %s against %s",scriptName, serverName)
                ns.exit()
            }
            var r2servers = ns.scan(serverName)
            for(var r2sn of r2servers){			
                if(r2sn !== "home"){			
                    if(!ns.exec(scriptName, "home", 1,r2sn)){
                        ns.tprintf("2 Failed to execute %s against %s",scriptName, r2sn)
                    }
                    var r3servers = ns.scan(r2sn)
                    for(var r3sn of r3servers){			
                        ns.tprint("r3" + r3sn)
                        if(r3sn !== r2sn && serverName !== r2sn){			
                            if(!ns.exec(scriptName, "home", 1,r3sn)){
                                ns.tprintf("3 Failed to execute %s against %s",scriptName, r2sn)
                            }
                
                        }
                    }
                }
            }
        }
    
    }
    
    }