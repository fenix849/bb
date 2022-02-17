/** @param {NS} ns **/
export async function main(ns) {
	var servers = ns.scan("home")
	for(var serverName of servers){
		if(ns.getServer(serverName).purchasedByPlayer){
			ns.killall(serverName)
			ns.deleteServer(serverName)
		}
	}
}