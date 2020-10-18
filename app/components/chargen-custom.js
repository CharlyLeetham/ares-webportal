import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  
	swiconicfsel: computed(function() {
		var swiconicf;
		swiconicf = this.get('char.custom.iconicf');
		return swiconicf;
	}), 
	
	swracesel: computed(function() {
		var swiconicf;
		swiconicf = this.get('char.custom.cgrace');
		return swiconicf;
	}),
	
	
	swsysedges: computed(function() {
		var swiconicf;
		swiconicf = this.get('char.custom.sysedges');
		return swiconicf;
	}),	
	
	swsyshind: computed(function() {
		var swiconicf;
		swiconicf = this.get('char.custom.swsyshind');
		// console.log (swiconicf);
		return swiconicf;
	}),
	

  didInsertElement: function() {
    let self = this;
    this.set('updateCallback', function() { return self.onUpdate(); } );
  },
  
  onUpdate: function() {
    // Return a hash containing your data.  Character data will be in 'char'.  For example:
    // 
    // return { goals: this.get('char.custom.goals') };
	return { iconicf: this.get('char.custom.charicf'), race: this.get('char.custom.charrace'), cgedges: this.get('char.custom.cgedges'), cgedgesnofw: this.get('char.custom.cgedgesnofw'), cghind: this.get('char.custom.cghind'), cghindnofw: this.get('char.custom.cghindnofw') };
  },
  
  
	actions: {
		iconicfChanged(val) {
			var charif, charcgp, cgslots, newifpoints, newval, resetifpoints, newrating, cgedg, swiconicf, systrait, newtraitlist, newtrlist, dislist, en, i, cgtr1=[];
			charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.charicf', val) //Set the selected Iconic Framework on the site.
			this.set('char.custom.charrace', 'None') //Set the Race to none.
			
			//Modify the CGen counters
			newval = val.split('~')[0].toLowerCase().trim(); //Take whatever Iconic Framework has been selected and chop every from ~ in the name, remove the trailing space.			
			charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
			cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.
			newifpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == newval); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			 
			for (const [key, value] of Object.entries(cgslots)) { //Loop through the init values. This is our yardstick.
				resetifpoints = newifpoints.filter(slots => slots.name.toString() == value['class']);  // Test to see if the slot is modified by the Iconic Framework. 
				if (Object.keys(resetifpoints).length === 0) { // If it isn't, do this.
					//console.log ('newrating='+value['rating']);
					newrating = value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
				} else {
					for (const [key1, value1] of Object.entries(resetifpoints)) {
						//console.log ('newrating='+value1['rating']+'+'+value['value']);
						newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
					}
				}
				//console.log ("inp-" + value['class']+".value= "+newrating);
				document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.
			}
			
			// Change the Edges set by the iconicf.
			systrait = this.get('char.custom.sysedges');
			cgedg = this.get('char.custom.cgedges');
			swiconicf = this.get('char.custom.sysiconicf');

			console.log(systrait);
			console.log(cgedg);
			
			//Change all items in the sysedg dropdown to enabled. 	
			dislist = Object.values(systrait).filter(slots => slots.disabled.toString().toLowerCase() == 'true'); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
			for (const [key, value] of Object.entries(dislist)) {
				//console.log (value['name']+' disabled='+value['disabled']);
				value['disabled'] = false //Set disabled for this element to false
			}		

			// Clear the edges list for the framework
			newtraitlist = swiconicf.filter(slots => slots.name.toString().toLowerCase() == newval); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
			newtrlist = newtraitlist[0].edges; // Select the edges for the new if
	
			//If there are new edges, go through and set these to disabled in the edge drop down.
			if (newtrlist) {
				i = 0;
				for (const [key, value1] of Object.entries(newtrlist)) {
					console.log(value1);
					en = value1.split('*')[0].toLowerCase().trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
					dislist = Object.values(systrait).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
					for (const [key, value] of Object.entries(dislist)) {
						value['disabled'] = true //Set disabled for this element to true
						// Write the new CG Edges array for a nice display
						cgtr1[i]=[]
						cgtr1[i]['class'] = value1;
						cgtr1[i]['name'] = en;
						cgtr1[i]['rating'] = value['desc'];
						i=i+1
					}
					console.log(cgedg);
					console.log(cgtr1);
				}
				
			}
			this.set('char.custom.sysedges', systrait); //Send the new dropdown back to the page. 
			this.set('char.custom.cgedges', cgtr1); //Send the new array back to the page for nice display. 
		},
		
		raceChanged(val) {
			var charrace, charif, charcgp, cgslots, newifpoints, newval, resetifpoints, resetracep, newrating, charracep, newrcpoints;
			
			charrace = this.get('char.custom.charrace');  //Get the value that was selected in the dropdown.
			charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.charrace', val);
			
			//Modify the CGen counters for the IF
			charif = charif.split('~')[0].toLowerCase().trim(); //Take whatever IF has been set and chop every from ~ in the name, remove the trailing space.	
			newval = val.split('~')[0].toLowerCase().trim(); //Take whatever Race has been selected and chop every from ~ in the name, remove the trailing space.
			
			charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
			charracep = this.get('char.custom.initracepoints');  // This is the array of all the races and values	
			cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.
			
			newifpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == charif); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			newrcpoints = Object.values(charracep).filter(slots => slots.ifname.toString() == newval); // Convert charcgp to an array and filter for any entries that match the new framework selected.

			//Reset newrating to 0 for each loop
			newrating = 0;

			for (const [key, value] of Object.entries(cgslots)) { //Loop through the init values. This is our yardstick.
				resetifpoints = newifpoints.filter(slots => slots.name.toString() == value['class']);  // Test to see if the slot is modified by the Iconic Framework. 
				if (Object.keys(resetifpoints).length === 0) { // If it isn't, do this. 
					newrating = value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
				} else {
					for (const [key1, value1] of Object.entries(resetifpoints)) {
						newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
					}
				}
				
				resetracep = newrcpoints.filter(slots => slots.name.toString() == value['class']);  // Test to see if the slot is modified by the Race.
				if (Object.keys(resetracep).length === 0) { // If it isn't, do this. 
					newrating = newrating;  // Set the value to newrating - which is either CGINIT or mod'd by IF.
				} else {
					for (const [key1, value1] of Object.entries(resetracep)) {						
						// console.log ("inp-" + value['class']+".value= "+newrating+" + "+value1['rating']);
						newrating = value1['rating']+newrating;  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
						// console.log ("inp-" + value['class']+".value= "+newrating);						
					}
				}
	
				document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.		
			}	
		},
		
		edgeChanged(val) {
			var charhind;
			// charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.cgedgesnofw', val);
		},		
		
		hindChanged(val) {
			var charhind;
			// charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.cghindnofw', val);
		}
	}
  
});
