//Not compatible with shorting
/** @param {NS} ns 
	@param {String} line */
    async function logtermprint(ns, line){
        let d = new Date()
        let datey = d.getFullYear()
        let datem = d.getMonth() + 1
        let dated = d.getDate()
        
        let timem = ns.nFormat(d.getMinutes(),"00")
        let timeh = ns.nFormat(d.getHours(), "00")
        let datestring = `${datey}-${datem}-${dated} ${timeh}:${timem} `
        await ns.write("sxlog.txt", datestring + line, "a")
        ns.tprint(datestring + line)
    
    }
    
    function abbrNum(number, decPlaces) {
        // 2 decimal places => 100, 3 => 1000, etc
        decPlaces = Math.pow(10,decPlaces);
    
        // Enumerate number abbreviations
        var abbrev = [ "k", "m", "b", "t" ];
    
        // Go through the array backwards, so we do the largest first
        for (var i=abbrev.length-1; i>=0; i--) {
    
            // Convert array index to "1000", "1000000", etc
            var size = Math.pow(10,(i+1)*3);
    
            // If the number is bigger or equal do the abbreviation
            if(size <= number) {
                 // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                 // This gives us nice rounding to a particular decimal place.
                 number = Math.round(number*decPlaces/size)/decPlaces;
    
                 // Handle special case where we round up to the next abbreviation
                 if((number == 1000) && (i < abbrev.length - 1)) {
                     number = 1;
                     i++;
                 }
    
                 // Add the letter for the abbreviation
                 number += abbrev[i];
    
                 // We are done... stop
                 break;
            }
        }
    
        return number;
    }
    
    /** @param {NS} ns **/
    export async function main(ns) {
        while(true)
        {
    
            for(let sxsym of ns.stock.getSymbols())
            {
                
                let nformatmethod = false
                let pos = ns.stock.getPosition(sxsym)
                let price = ns.stock.getBidPrice(sxsym)
                if(price < 1000){
                    nformatmethod = true
                }
                let holding = pos[0]
                let fc = ns.stock.getForecast(sxsym)
                let sres = 0
                let sale = holding*price
                if(holding){
                    if(fc < 0.7)
                    {	
                        //console.log("Trying to sell" + Math.floor(holding) + " Shares in " + sxsym + ".")
                        let sres = ns.stock.sell(sxsym, Math.floor(holding))
                        
                        if(sres > 0)
                        {
                            await logtermprint(ns, "Sold " + abbrNum(holding,2) + " shares in " + sxsym + " at " + (nformatmethod ? ns.nFormat(price,"0.00") : abbrNum(price,2)) + " for $" + abbrNum(sale,2) + " because forecast is " + ns.nFormat(fc,"0.000") + ".\n")
                            
                        }
                        else
                        {
                            await logtermprint(ns, "Failed to sell " + abbrNum(holding,2) + " shares in " + sxsym + "at " + (nformatmethod ? ns.nFormat(price,"0.00") : abbrNum(price,2)) + " for $" + abbrNum(sale,2) + ", forecast was " + ns.nFormat(fc,"0.000") + ".\n")
                            
                        }
                        
                    }
                }			
                else
                {
                    if(fc > 0.7)
                    {	
                        
                        let sharemax = ns.stock.getMaxShares(sxsym)
                        let funds = ns.getServerMoneyAvailable("home")
                        let price = ns.stock.getAskPrice(sxsym)					
                        if(price < 1000){
                            nformatmethod = true
                        }
                        else{
                            nformatmethod = false
                        }
                        console.log(nformatmethod)
                        let maxbuy = Math.floor(funds/price)
                        let	actbuy = Math.min(sharemax, maxbuy)
                        let cost = actbuy*price
                        if(ns.stock.buy(sxsym, actbuy))
                        {
                            await logtermprint(ns, "Brought " + abbrNum(actbuy,2) + " shares in " + sxsym + " at " + (nformatmethod ? ns.nFormat(price,"0.00") : abbrNum(price,2)) + " for $" + abbrNum(cost,2) + " because forecast is " + ns.nFormat(fc,"0.000") + ".\n")
                            
                        }
                        else
                        {
                            await logtermprint(ns, "Failed to buy " + abbrNum(actbuy,2) + " shares in " + sxsym + " at " + (nformatmethod ? ns.nFormat(price,"0.00") : abbrNum(price,2)) + " for $" + abbrNum(cost,2) + ", forecast was " + ns.nFormat(fc,"0.000") + ".\n")
                            
                        }					
                    }
                }
            }
            await ns.sleep(6000)
        }
    
    }