/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    console.log(target)
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(target);
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(target);
    }
    if (ns.fileExists("relaySMTP.exe","home")) {
        ns.relaysmtp(target)
    }
    if(ns.fileExists("HTTPWorm.exe","home")) {
        ns.httpworm(target)
    }
    if(ns.fileExists("SQLInject.exe","home")) {
        ns.sqlinject(target)
    }
    if(ns.getServerRequiredHackingLevel(target) <= ns.getHackingLevel()){
        ns.nuke(target);    
    }
    else{
        ns.tprintf("Hacking %s failed, hacking required for %s (%s/%s) too high.", target, target, ns.getHackingLevel(), ns.getServerRequiredHackingLevel(target))
    }
    
    if(ns.hasRootAccess(target)){
        ns.tprint("Hacked:" + target)
    }else{
        ns.tprint("Failed:" + target)
    }
}