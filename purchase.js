/** @param {NS} ns **/

function highestPowerof2(n)
{
	let res = 0;
	for (let i = n; i >= 1; i--)
	{
		// If i is a power of 2
		if ((i & (i - 1)) == 0)
			{
				res = i;
			break;
			}
	}
	return res;
}

export async function main(ns) {
	const serverpricepergb = 55000
	var money = ns.getPlayer().money
	if(ns.args[0] && !isNaN(ns.args[0])){
		money = ns.args[0] * 1000000
	}
	if(money > ns.getPlayer().money){
		ns.tprintf("Insufficient money, you do not have %sm.", ns.nFormat(money/1000000,"0.00"))
		ns.exit()
	}
	
	
	var flimit = 0
	var slimit = ns.getPurchasedServerLimit()
	var scount = ns.getPurchasedServers().length
	var maxgbformoney = Math.floor((money/slimit)/55000)
	var maxgbpow2 = highestPowerof2(maxgbformoney)
	if(scount == 25){
		ns.tprintf("%s/%s slots used, use delete.js.",scount,slimit)
		ns.tprintf("%s servers could be purchased with %sGB ram with $%sm of $%sm.", slimit, maxgbpow2, ns.nFormat(((55000*(maxgbpow2))*25)/1000000, "0.00"), ns.nFormat(money/1000000,"0.00") )
		ns.tprintf("Next ram upgrade (%s*%sGB) at $%sm", slimit,maxgbpow2*2 , ns.nFormat(((55000*(maxgbpow2*2))*25)/1000000, "0.00"))
		ns.exit()
	}
	else{
		flimit = slimit - scount
	}
	
	ns.tprintf("%s/%s slots used.",scount,slimit)
	ns.tprint("Purchasing " + flimit + " servers with " + maxgbpow2 + "GB")
	for (let i=0; i < slimit; i++){		
		ns.purchaseServer("pserv"+i,maxgbpow2)
	}
}