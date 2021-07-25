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
	return { iconicf: this.get('char.custom.charicf'), race: this.get('char.custom.charrace'), cgedges: this.get('char.custom.cgedges'), cgedgesnofw: this.get('char.custom.cgedgesnofw'), cghind: this.get('char.custom.cghind'), cghindnofw: this.get('char.custom.cghindnofw'), hjtables: this.get('char.custom.hjtables') };
	},
  
	ck_excludes: function(dislist, sysedg, traittype) {
		var trexcludes;
		// Check to see the Hinderance excludes others and mark them as disabled.
		if (dislist[0]['trexcludes'].length > 0) {
			for (const [k1, v1] of Object.entries(dislist[0]['trexcludes'])) {
				trexcludes = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == v1.toLowerCase());
				trexcludes[0]['disabled']= true;
			}
		}	
	},

	ck_includes: function(dislist, sysedg, traittype) {
		var trexcludes;
		// Check to see the Hinderance excludes others and mark them as disabled.
		if (dislist[0]['trexcludes'].length > 0) {
			for (const [k1, v1] of Object.entries(dislist[0]['trexcludes'])) {
				trexcludes = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == v1.toLowerCase());
				trexcludes[0]['disabled']= false;
			}
		}	
	},
  
  	find_duplicate_in_array: function(arra1) {
		var object = {};
		var result = [];

		arra1.forEach(function (item) {
		  if(!object[item])
			  object[item] = 0;
			object[item] += 1;
		})

		for (var prop in object) {
		   if(object[prop] >= 2) {
			   result.push(prop);
		   }
		}

		return result;
	},
 
	changedges: function( sysedg, newedgarray, traittype, fw ) {
		// This changes the arrays on the page for Hinderances and Edges based on the Race / ICF that has been changed. Whilst something is returned, the return value is not used. 
		
		/// Passed In: ///
		/// sysedg = All System edges
		/// newedgarray = Edges for selected ICF
		/// traittype = Edge or Hinderance
		/// fw = ICF or Race
		
		var cgtrnewedg=[], i, en, specchar, dislist, exedg, traitclass, loc2, trexcludes, cgtr1=[], ctr, nesize, eesize, swriftstmp, tmplist;
		
		
		// Get either edges or hinderances based on the traittype passed in.
		if ( traittype=='edge' ) {
			exedg = this.get('char.custom.cgedges');
		} else {
			exedg = this.get('char.custom.cghind');		
		}


		// Set the special character to add to the end of edges or hinderances based on the fw passed in.
		if ( fw == 'icf' ) {
			specchar = '*';
		} else if ( fw == 'race' ) {
			specchar ='^';
		}


		///// Debugging /////
		if (traittype == 'edge') {
			console.log ('Exedg: ');
			console.log (exedg);
		}
		///// End Debug /////
				
		if ( Object.keys(exedg).length > 1 ) {	// If there are edges or hinderances already set on the character, get them back	
			i = 0;		
			if ( fw=='icf' ) { // If we're looking at changing the Iconic Framework, find out which attributes are marked as Racial features. We want to keep these and remove all the ICF ones)
				for ( const[ed, desc] of Object.entries(exedg) ) {
					console.log ('ed: ');
					console.log (ed);
					console.log ('desc: ');
					console.log (desc);
					// en = value.split(specchar)[0].toLowerCase().trim(); // Take the trailing * or ^ from the edge for I/F's
					// dislist = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the trait list to an array and filter for any entries that match the new traits selected.					
					if (desc['class'].includes('^')) {						
						cgtrnewedg[i] = [];
						cgtrnewedg[i]['class']=desc['class'];
						cgtrnewedg[i]['name']=desc['name'];
						cgtrnewedg[i]['rating']=desc['rating'];
						i=i+1;
					}
				}
			} else if ( fw=='race') {	// If we're looking at changing the Race, find out which attributes are marked as ICF features. We want to keep these and remove all the race ones)
				for ( const[ed, desc] of Object.entries(exedg) ) {
					console.log ('ed: ');
					console.log (ed);
					console.log ('desc: ');
					console.log (desc);					
					if (desc['class'].includes('*')) {
						cgtrnewedg[i]=[];
						cgtrnewedg[i]['class']=desc['class'];
						cgtrnewedg[i]['name']=desc['name'];
						cgtrnewedg[i]['rating']=desc['rating'];
						i=i+1;
					}
				}
			}
		}
		
		
		
		/// Debugging /////
		// if (traittype == 'edge') {
			// console.log (sysedg);
			// console.log ('New Edges: ');
			// console.log (newedgarray);
			// console.log (traittype);
			// console.log (fw);		
			// console.log ('cgtrnewedg:');
			// console.log (cgtrnewedg);
			// console.log ('New Edge Array: ');
			// console.log (newedgarray);			
		// }
		///// End Debug /////

		
		//Get all the details for the New Edges passed in. This is need to do the combination of the arrays below.
		
		if ( newedgarray ) {
			var ctr1=0;
			for ( const [key, value] of Object.entries(newedgarray) ) {  // We need to find matching traits and apply the appropriate special characters to the end.
				en = value.split(specchar)[0].toLowerCase().trim(); // Take the trailing * or ^ from the edge for I/F's
				tmplist = Object.values(cgtrnewedg).filter(slots => slots.name.toString().toLowerCase() == en);
				dislist = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the trait list to an array and filter for any entries that match the new traits selected.
				console.log (dislist);
				
				if ( Object.keys(tmplist).length == 0 ) { // If there's no match in the existing edge array, we want this entry							
					cgtr1[ctr1]=[];
					cgtr1[ctr1]['class'] = value;
					cgtr1[ctr1]['name'] = dislist[0]['name'].toString().toLowerCase();
					cgtr1[ctr1]['rating'] = dislist[0]['desc'];					
					// Set this trait as disabled in the drop list for traits.
					dislist[0]['disabled'] = true;
				} else { // If there is a match

					// set disabled to true 
					dislist[0]['disabled'] = true;
					if ( traittype == 'hind' ) { // What are we checking for here exactly?????
						trexcludes = this.ck_excludes(dislist, sysedg, traittype);
					}	
					loc2 = dislist[0]['name']; // Get the nice name from System Edges file
					loc2 = loc2+'*^'; // Add the right special characters to it.
					tmplist[0]['class'] = loc2;												
				}
				ctr1++;				
			}				

			/// Debugging /////
			// if (traittype == 'edge') {
				console.log (tmplist);			
				console.log (cgtrnewedg);			
			// }
			///// End Debug /////
			// cgtr1 now has a list of the new traits that aren't already on the character.
		
			//If there are new traits, go through and set these to disabled in the edge drop down.
			
			ctr = 0; //counter for new trait array that will be created of traits common to both race and icf.		
			// for ( const [key, value] of Object.entries(newedgarray) ) {  // We need to find matching traits and apply the appropriate special characters to the end.
				// en = value.split(specchar)[0].toLowerCase().trim(); // Take the trailing * or ^ from the edge for I/F's			
				// dislist = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
						
				// if ( cgtrnewedg.length > 0 ) {  // Are there existing traits? Then, check to see if the trait already exists in the new array. This allows for Race and ICF to add the same things. 
					// for ( const [key2, value2] of Object.entries(cgtrnewedg) ) {					
						// if (value2['name'].toLowerCase().startsWith(en)) { //Does the name in the array of traits for the fw selected, match one that is already set on the character?								
							// if ( fw =='icf' ) { // If so, are looking at changing the ICF?						
								// loc2 = value2['class'].split('^')[0].trim(); // Take the trailing * from the edge for I/F's
								// loc2 = loc2+'*^';					
								// cgtrnewedg[key2]['class'] = loc2;
								// ctr++;
							// } else {  // otherwise we must be changing Race.
								// loc2 = value2['class'].split('*')[0].trim(); // Take the trailing * from the edge for I/F's
								// loc2 = loc2+'*^';
								// cgtrnewedg[key2]['class'] = loc2;
								// ctr++;								
							// } 						
						// }					
					// }
					// Combine cgtrnewedg and newedgarray - removing any duplicates.  
					
					// Find out which is smaller, so we can use that as our base.
					// eesize = Object.keys(cgtrnewedg).length;
					// nesize = Object.keys(newedgarray).length;
					
					// if ( eesize < nesize ) {
						// swriftstmp = cgtrnewedg;
					// } else {
						// swriftstmp = newedgarray;
					// }
					
					// for ( const [newkey, newval] of Object.entries(swriftstmp) ) {
						// console.log ( 'newkey: ' + newkey);
						// console.log ( 'newval: ');
						// console.log ( newval);
					// }
						
						
					
					
				// } else { // We have no existing traits, so we have to write the array. 
					// for (const [key2, value2] of Object.entries(newedgarray)) {	
						///// Debugging /////
						// console.log ( 'Key2: ' +key2 );
						// console.log ( 'Value2:');
						// console.log ( value2['class'] );									
						///// End Debug /////
					// }
				// }
				///// Debugging /////
				// console.log ( 'cgtrnewedg: ' );	
				// console.log ( cgtrnewedg );	
				///// End Debug /////					
			// }
		}
		
		// sort the data
		// cgtr1.sort(function (x, y) {
			// let a = x.name.toLowerCase(),
				// b = y.name.toLowerCase();
			// return a == b ? 0 : a > b ? 1 : -1;
		// });
				
		if ( traittype == 'edge' ) {
			// console.log ( 'here' );
			// console.log ( 'Sysedg' );
			// console.log ( sysedg );
			// console.log ( 'cgtr1' );
			// console.log ( cgtr1 );
			this.set('char.custom.sysedges', sysedg); //Send the new dropdown back to the page. 
			this.set('char.custom.cgedges', cgtr1); //Send the new array back to the page for nice display. 	
			this.set('char.custom.cgedgesfw', cgtr1); //Send the new array back to the page for nice display. 	
		} else {
			this.set('char.custom.swsyshind', sysedg); //Send the new dropdown back to the page. 
			this.set('char.custom.cghind', cgtr1); //Send the new array back to the page for nice display.			
			this.set('char.custom.cghindfw', cgtr1); //Send the new array back to the page for nice display.			
		}
		return (cgtr1);
	},
	
	checktrait: function(swraceall, swiconicfall, swrace, swiconicf, chosenifarray, newval, traittype) {	
		//// Passed in: ///
		/// swraceall = All system races
		/// swiconicfall = All icf's
		/// swrace = race chosen by player
		/// swiconicf = icf chosen by player
		/// chosenifarray = filtered icf array
		/// newval = Pure ICF without the trailing ~
		/// traittype = Tells function whether we're working on icf or race		
		
		// Check ICF / Race and make sure it can be used. If it can't, grey it out from the list. Allow them to select None, to reset the list.
		var i = 0, dislist44, evalrace=[], en1, complrace, newedgarray, newhindarray, newcyberarray, comptypearray=[], comptypearray2=[], comptypearray3=[], comptypearray4=[], lowedgarray, racecompl, fullsys, listsys, rppe, risp, rnsb, rcyber, rbp;
		
		if (traittype == 'icf') {
			fullsys = swraceall;
			listsys = swrace;
		} else {
			fullsys = swiconicfall;
			listsys = swiconicf;					
		}		
		
		newedgarray = chosenifarray[0].edges; // Select the edges for the new if
		if (newedgarray) {
			lowedgarray = newedgarray.map(newedgarray => newedgarray.toLowerCase());	
		}
		newhindarray = chosenifarray[0].hinderances; // Select the hinderances for the new if
		newcyberarray = chosenifarray[0].cybernetics; // Select the cybernetics for the new if
		racecompl = chosenifarray[0].complications;		
		
		comptypearray = ['ab miracles*', 'ab magic*']; // Used for PPE check
		comptypearray2 = ['ab psionics*']; // Used for psionics check
		comptypearray3 = ['power armor jock*']; // Used for cyber check
		comptypearray4 = ['juicer', 'crazy']; // Used for Bizarre Physiology
		rppe = "Restricted Path PPE^";
		risp = "Restricted Path ISP^";
		rcyber = "Cyber Resistant^";
		rnsb = "Non-Standard Build^";
		rbp = "Bizarre Physiology^";
			
		if (traittype == 'icf') {
			for (const [key, value] of Object.entries(swraceall)) { //Loop through the race values. We want to know which races an Iconic Framework can't have.		
				
				complrace = value.hasOwnProperty('complications');

				if (complrace && newedgarray) { //Complications exist on the character
					for (const [k, v] of Object.entries(value.complications)) {
						var ppe_check = v.includes(rppe) // see if the race has the value
						var isp_check = v.includes(risp) //see if the race has the value
						var cyber_check = v.includes(rcyber) //see if the race has the value
						var nsb_check = v.includes(rnsb) //see if the race has the value
						var bp_check = v.includes(rbp) //see if the race has the value	
						if (ppe_check == true) {
							var ppetest = lowedgarray.some(v => comptypearray.includes(v));
						}

						if (ppe_check == true) {
							var ppetest = lowedgarray.some(v => comptypearray.includes(v));
							// Check if the race can use this 
						}	

						if (isp_check == true) {
							var isptest = lowedgarray.some(v => comptypearray2.includes(v));		
						}											
						
						if (nsb_check == true) {
							var nsbtest = lowedgarray.some(v => comptypearray3.includes(v));		
						}						
						
						if (bp_check == true) {
							var bptest = lowedgarray.some(v => comptypearray4.includes(v));
						}

						if (newcyberarray) {
						}

						if (ppe_check==true || isp_check==true || nsb_check == true || bp_check == true || newcyberarray) {
							// console.log(en1);
							en1 = value.name.split('*')[0].toLowerCase().trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
							if (evalrace.includes(en1)) {
								// console.log('in there dummy');
							} else {
								evalrace[i]=en1;
								i = i+1;								
							}
						}	
					}
					
				}
			}
		} else {		
			if (racecompl) {
				// Check to see if the Race includes things that the IF can't have //
				
				var ppe_check = racecompl.includes(rppe) // see if the race has the value
				var isp_check = racecompl.includes(risp) //see if the race has the value
				var cyber_check = racecompl.includes(rcyber) //see if the race has the value
				var nsb_check = racecompl.includes(rnsb) //see if the race has the value
				var bp_check = racecompl.includes(rbp) //see if the race has the value				
	
				// Check the Race and make sure it can be used. If it can't, grey it out from the list. Allow them to select None, to reset the list.
				var i = 0;
				
				for (const [key, value] of Object.entries(fullsys)) { //Loop through the race values. We want to know which races an Iconic Framework can't have.			
					if (value.edges) { //Complications exist on the character
						for (const [k, v] of Object.entries(value.edges)) {
							// console.log('Key: '+k);
							// console.log('Vlaue:' +v.toLowerCase());
							if (ppe_check == true) {
								var ppetest = comptypearray.includes(v.toLowerCase());	
								// Check if the race can use this 
							}	

							if (isp_check == true) {
								var isptest = comptypearray2.includes(v.toLowerCase());		
							}											
							
							if (nsb_check == true) {
								var nsbtest = comptypearray3.includes(v.toLowerCase());		
							}						
							
							if (bp_check == true) {
								var bptest = comptypearray4.includes(v.toLowerCase());		
							}

							if (newcyberarray) {
							}

							if (ppe_check==true || isp_check==true || nsb_check == true || bp_check == true || newcyberarray) {
								
								// console.log (value.name);
								// We need to determine if the IF has this edge
								if (!evalrace.includes(value.name)) {
									evalrace[i]=value.name;	
									i=i+1;
								}
							}	
						}
						
					}
				}
			}
		}		

		dislist44 = Object.values(listsys).filter(slots => slots.disabled.toString().toLowerCase() == 'true'); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
				
		
		for (const [key, value] of Object.entries(dislist44)) {
			value['disabled'] = false //Set disabled for this element to false
		}					
		
		if (evalrace) {
			for (const [k, v] of Object.entries(evalrace)) {
				var dislist44 = Object.values(listsys).filter(slots => slots.class.toString().toLowerCase() == v.toLowerCase()); 					
				
				// Convert the iconic framework list to an array and filter for any entries that match the new framework selected.	
				for (const [k1, v1] of Object.entries(dislist44)) {
					v1['disabled'] = true //Set disabled for this element to true							
				}
			}
		}
		return;
	},

	// Reset ICF or Race to none.
	fwreset: function(fwname, fw) { //Array of system settings, what we're working on (Race or ICF)
		
		//fwname is either all the icf's or all the races. fw is icf or race depending on what is reset
		
		var cgedgfw, cghindfw, dislist, exedg, exhind, i, cgtr1=[], cgtr2=[], newclass, hjslots, hjtables, curricf, currrace;
		
		dislist = Object.values(fwname).filter(slots => slots.disabled.toString().toLowerCase() == 'true'); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
					
		for (const [key, value] of Object.entries(dislist)) {
			value['disabled'] = false //Set disabled for this element to false
		}
		
		exedg = this.get('char.custom.cgedges');
		exhind = this.get('char.custom.cghind');

		//Because we have to set edges and such based on the selected ICF and Race, we need to know what's selected where. 
		curricf = this.get('char.custom.charicf');
		currrace = this.get('char.custom.charrace');
		
		//Reset Edges
		i = 0;	
		
		// Reset attributes for ICF set to None
		if ( curricf['class'].toLowerCase() == 'none' ) {
			for (const[ed, desc] of Object.entries(exedg)) {
				if (desc['class'].endsWith('*^')) {
					cgtr1[i]=[];
					newclass = desc['class'].split('*')[0].trim(); // Take the trailing * from the edge for I/F's
					newclass =  newclass+"^";
					cgtr1[i]['class']=newclass;
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('^')) {
					cgtr1[i] = [];
					cgtr1[i]['class']=desc['class'];
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('*')) {
					cgtr1[i]='';
				}
			}
		}
		
		// Reset attributes for Race set to None
		
		if ( currrace['class'].toLowerCase() == 'none') {
			for (const[ed, desc] of Object.entries(exedg)) {
				if (desc['class'].endsWith('*^')) {
					cgtr1[i]=[];
					newclass = desc['class'].split('*')[0].trim(); // Take the trailing * from the edge for I/F's
					newclass =  newclass+"*";						
					cgtr1[i]['class']=newclass;
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('*')) {
					cgtr1[i]=[];
					cgtr1[i]['class']=desc['class'];
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('^')) {
					cgtr1[i]='';
				}
			}
		}		
		
		//Reset Hinderances
		i = 0;

		if ( curricf['class'].toLowerCase() == 'none' && currrace['class'].toLowerCase() == 'none' ) {
			cgtr1[i] = [];
			cgtr2[i] = [];
		}
		
		if ( curricf['class'].toLowerCase() == 'none' ) {
			for (const[ed, desc] of Object.entries(exhind)) {
				if (desc['class'].endsWith('*^')) {
					cgtr1[i]=[];
					newclass = desc['class'].split('*^')[0].trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
					newclass =  newclass+"^";
					cgtr1[i]['class']=newclass;
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('^')) {
					cgtr2[i] = [];
					cgtr2[i]['class']=desc['class'];
					cgtr2[i]['name']=desc['name'];
					cgtr2[i]['rating']=desc['rating'];
					i=i+1;
				}
			}
		}

	    if ( currrace['class'].toLowerCase() == 'none' ) {
			for (const[ed, desc] of Object.entries(exhind)) {
				if (desc['class'].endsWith('*^')) {
					cgtr1[i]=[];
					newclass = desc['class'].split('*^')[0].trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
					newclass =  newclass+"*";
					cgtr1[i]['class']=newclass;
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('*')) {
					cgtr2[i]=[];
					cgtr2[i]['class']=desc['class'];
					cgtr2[i]['name']=desc['name'];
					cgtr2[i]['rating']=desc['rating'];
					i=i+1;
				}
			}
		}
		
		//Reset Heroes Journeys
		hjtables = [];
		hjslots = [];


		// this.resetcounter(fwname);
		this.set('char.custom.cgedgesfw', cgtr1); //Send the new array back to the page for nice display. 		
		this.set('char.custom.cghindfw', cgtr2); //Send the new array back to the page for nice display.
		this.set('char.custom.cgedges', cgtr1); //Update the edges set on the Character
		this.set('char.custom.cghind', cgtr2); //Update the hinderances set on the Character.
		this.set('char.custom.hjtables', hjtables);  //Set Heroes Journey 
		this.set('char.custom.hjslots', hjslots);  //Set Heroes Journey 
		return;
	},
	
	resetcounter: function(fwname) {
		var charcgp, racecgp, cgslots, newicfpoints, newifpoints, newracepoints, newrcpoints, newrating, raceval, icfval, newicf, newrace;
		charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
		racecgp = this.get('char.custom.initracepoints'); // An array of all races and values.
		cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.
		newicf = this.get('char.custom.charicf');
		newrace = this.get('char.custom.charrace');
		newrating = 0;
		
		
		if (newicf['class'] != 'none') {
			newicfpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == newicf['class'].toLowerCase()); // Convert charcgp to an array and filter for any entries that match the new framework selected.			
			icfval = newicf['class'].toLowerCase();
		}
		

		
		if (newrace['class'] != 'none') {
			newracepoints = Object.values(racecgp).filter(slots => slots.ifname.toString() == newrace['class']); // Convert charcgp to an array and filter for any entries that match the new framework selected.	
			raceval = newrace['class'];
		}
		
		for (const [key, value] of Object.entries(cgslots)) { //Loop through the init values. This is our yardstick.
			newrating = 0;
			newrcpoints = Object.values(racecgp).filter(slots => slots.ifname.toString() == raceval); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			if (Object.keys(newrcpoints).length === 0) { // If it isn't, do this.
				newrating = value['rating'] + value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
			} else {
				for (const [key1, value1] of Object.entries(newrcpoints)) {
					newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
				}
			}
			
			newifpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == icfval); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			if (Object.keys(newifpoints).length === 0) { // If it isn't, do this.
				newrating = value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
			} else {
				for (const [key1, value1] of Object.entries(newifpoints)) {
					newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
				}
			}

			document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.		
		}
	},
  
	actions: {
		iconicfChanged(val) {
			var charif, charcgp, chosenifarray, cgslots, newifpoints, newval, resetifpoints, newrating, cgedg, cghind, swiconicf, swiconicfall, dislist44, newedgarray, newhindarray, newcyberarray, racecompl, sysedg, syshind, swrace, swraceall, newtrait, hjtables;

			// Common things to do 
			charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.charicf', val) //Set the selected Iconic Framework on the site.
			
			swiconicfall = this.get('char.custom.sysiconicf');	// Get all the Iconic Frameworks.
			swraceall = this.get('char.custom.swrifts_race'); // Get all the system races.			
			sysedg = this.get('char.custom.sysedges'); // Get all the System Edges
			syshind = this.get('char.custom.swsyshind');// Get all the System Hinderances		
			cgedg = this.get('char.custom.cgedges'); // Get the edges on the character now.
			newval = val['name'].split('~')[0].toLowerCase().trim(); //Take whatever Iconic Framework has been selected and chop every from ~ in the name, remove the trailing space.			
			
			swiconicf = this.get('char.custom.iconicf'); // Get the iconic frameworks formatted for drop down. This is needed to send the updated races back to the page for selection.		
			swrace = this.get('char.custom.cgrace'); // Get the system races formatted for drop down. This is needed to send the updated races back to the page for selection.		
			cghind = this.get('char.custom.cghind'); // Hinderances on the Character.


			// If the None option is selected, reset the lists.
			if (val['class'].toLowerCase() == 'none') {
				// Need to reset the ICF dropdown if this is the case.	
				this.fwreset(swrace, 'icf') //Send all the icf's through and the fact we're changing the icf;
				return;
			}			
			
			chosenifarray = swiconicfall.filter(slots => slots.name.toString().toLowerCase() == newval); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
			
			newedgarray = chosenifarray[0].edges; // Select the edges for the new if
			newhindarray = chosenifarray[0].hinderances; // Select the hinderances for the new if
			newcyberarray = chosenifarray[0].cybernetics; // Select the cybernetics for the new if
			racecompl = chosenifarray[0].complications;	


			/////  Debugging /////
			// console.log ('Edges: ');
			// console.log (newedgarray);
			///// End Debug /////

			// Check race
			var newtrait;
			newtrait = this.checktrait(swraceall, swiconicfall, swrace, swiconicf, chosenifarray, newval, 'icf');	// This returns nothing. It's not used in this function, it's used to adjust other arrays on the page.
			//// Passed out: ///
			/// swraceall = All system races
			/// swiconicfall = All icf's
			/// swrace = race chosen by player
			/// swiconicf = icf chosen by player
			/// chosenifarray = filtered icf array
			/// newval = Pure ICF without the trailing ~
			/// 'icf' = Tells function we're working on the iconicframework. 

			
			// Change the Edges set by the iconicf.		
			var newedg;		
			newedg = this.changedges(sysedg, newedgarray, 'edge', 'icf');
			/// Passed out: ///
			/// sysedg = All System edges
			/// newedgarray = Edges for selected ICF
			/// 'edge' = Tell function we're working on edges
			/// 'icf' = Tell function we're working on a change in the ICF.
			
			
			///// Debugging /////
			console.log ('Newedg:' + newedg);
			///// End Debug /////
			
			
			// Change the Hinderances set by the iconicf.
			var newhind;	
			// newhind = this.changehind(syshind, newhindarray, 'icf');
			newhind = this.changedges(syshind, newhindarray, 'hind', 'icf');
			/// Passed out: ///
			/// sysedg = All System edges
			/// newedgarray = Edges for selected ICF
			/// 'hind' = Tell function we're working on hinderances
			/// 'icf' = Tell function we're working on a change in the ICF.

			//Update the Heroic Journey Tables
			// Change the options displayed to the player
			var newhjtables = [];			
			newhjtables = Object.values(swiconicfall).filter(slots => slots.name.toString().toLowerCase() == newval); // Convert swiconicfall to an array and filter for any entries that match the new framework selected.	
			newhjtables = newhjtables[0];
			
			if (newhjtables) {
				var tmptable=[], hjname, i;
				for (const [key, value] of Object.entries(newhjtables)) {
					if (key.startsWith('hj')) {
						hjname = key.split('_')[0].toLowerCase().trim(); //Take the key name and remove the _ and everything after.
						tmptable[hjname]=[];
						i=0
							for (const [k1, v1] of Object.entries(value)) {
								tmptable[hjname][i]=[];
								tmptable[hjname][i]['name']=hjname;
								tmptable[hjname][i]['table']=v1;
								i++ // increment our counter so our array grows.									
							}
					
					}

				}
			}
			this.set('char.custom.hjslots', tmptable); //Send the new array back to the page for nice display.

			//Reset Heroes Journeys already set on the character
			hjtables = [];
			this.set('char.custom.hjtables', hjtables);  //Set Heroes Journey 
		
					
			//Modify the CGen counters
			charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
			cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.
			
			newifpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == newval); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			for (const [key, value] of Object.entries(cgslots)) { //Loop through the init values. This is our yardstick.
				resetifpoints = newifpoints.filter(slots => slots.name.toString() == value['class']);  // Test to see if the slot is modified by the Iconic Framework. 
				
				if (Object.keys(resetifpoints).length === 0) { // If it isn't, do this.
				
					newrating = value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
				} else {
					for (const [key1, value1] of Object.entries(resetifpoints)) {
						//console.log ('newrating='+value1['rating']+'+'+value['value']);
						newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
					}
				}
				document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.
			}
		},
		
		newRaceChanged(val) {
			var charif, charcgp, charrace, cgslots, newifpoints, newval, resetifpoints, newrating, cgedg, cghind, swiconicf, swiconicfall, dislist, chosenifarray, newedgarray, newhindarray, sysedg, syshind, swrace, swraceall, newcyberarray, racecompl, newtrait;

			charrace = this.get('char.custom.charrace');  //Get the value that was selected in the dropdown.	
			
			charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.charrace', val); //Set the selected Race on the site.
			swiconicfall = this.get('char.custom.sysiconicf');	// Get all the Iconic Frameworks.
			swraceall = this.get('char.custom.swrifts_race'); // Get all the system races.			
			sysedg = this.get('char.custom.sysedges'); // Get all the System Edges
			syshind = this.get('char.custom.swsyshind');// Get all the System Hinderances		
			cgedg = this.get('char.custom.cgedges'); // Get the edges on the character now.
			cghind = this.get('char.custom.cghind'); // Hinderances on the Character. 			

			// Common things to do 
			newval = val['name'].split('~')[0].toLowerCase().trim(); //Take whatever Race has been selected and chop every from ~ in the name, remove the trailing space.

			swiconicf = this.get('char.custom.iconicf'); // Get the system iconic frameworks formatted for drop down. This is needed to send the updated races back to the page for selection.			
			swrace = this.get('char.custom.cgrace'); // Get the system races. This is needed to send the updated races back to the page for selection.	
			
			// If the None option is selected, reset the lists.
			if (val.class.toLowerCase() == 'none') {
				// Need to reset the ICF dropdown if this is the case.
				this.fwreset(swiconicf, 'race'); //Send all the race's through and the fact we're changing the race;
				return;
			}	
			
			this.set('char.custom.charrace', val) //Set the Race to the chosen race	

			chosenifarray = swraceall.filter(slots => slots.name.toString().toLowerCase() == newval); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
			
			newedgarray = chosenifarray[0].edges; // Select the edges for the new if
			newhindarray = chosenifarray[0].hinderances; // Select the hinderances for the new if
			newcyberarray = chosenifarray[0].cybernetics; // Select the cybernetics for the new if
			racecompl = chosenifarray[0].complications;			
			
			// I/F Check 
			newtrait = this.checktrait(swraceall, swiconicfall, swrace, swiconicf, chosenifarray, newval, 'race');		


			/////  Debugging /////
			// console.log ('Edges: ');
			// console.log (newedgarray);
			///// End Debug /////
			
			
			// Change the Edges set by the race.
			var newedg;		
			newedg = this.changedges(sysedg, newedgarray, 'edge', 'race');
			/// Passed out: ///
			/// sysedg = All System edges
			/// newedgarray = Edges for selected race
			/// 'edge' = Tell function we're working on edges
			/// 'race' = Tell function we're working on a change in the race.			
			
			// Change the Hinderances set by the race.
			var newhind;	
			// newhind = this.changedges(syshind, newhindarray, 'hind', 'race');
			/// Passed out: ///
			/// sysedg = All System edges
			/// newedgarray = Edges for selected race
			/// 'hind' = Tell function we're working on hinderances
			/// 'race' = Tell function we're working on a change in the race.			
			
			//Modify the CGen counters	
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
				document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.
			}
		},
		
		edgeChanged(val) {
			var sysedges, charedges, charedgesall, dislist, dislist33, trexcludes, nonfwedges;
			sysedges = this.get('char.custom.sysedges');
			charedges = this.get('char.custom.cgedges');
			charedgesall = this.get('char.custom.cgedgesfw');
			nonfwedges = this.get('char.custom.cgedgesnofw');
			
			// Reset the non-framework and race edges on the character.	
			for (const[k3, v3] of Object.entries(nonfwedges)) {
				v3['disabled']=false;
				dislist = Object.values(sysedges).filter(slots => slots.name.toString().toLowerCase() == v3['name'].toLowerCase());
				dislist[0]['disabled'] = false;
				if (dislist[0]['trexcludes'].length > 0) {
					trexcludes = this.ck_includes(dislist, sysedges, 'edge');
				}				
			}
			
			for (const[k1, v1] of Object.entries(charedges)) {			
				if (!v1['class'].endsWith('*^') && !v1['class'].endsWith('*') && !v1['class'].endsWith('^') ) {
					dislist33 = Object.values(val).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase());
					if (dislist33.length < 1) {
						v1['disabled'] = false;
						dislist = Object.values(sysedges).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase());
						dislist[0]['disabled'] = false;
						if (dislist[0]['trexcludes'].length > 0) {
							trexcludes = this.ck_includes(dislist, sysedges, 'edge');
						}						
					}
				}
			}
			
			for (const [key, value] of Object.entries(val)) {
				value['disabled']=false;				
				dislist = Object.values(sysedges).filter(slots => slots.name.toString().toLowerCase() == value['name'].toLowerCase()); // Convert sysedges to an array and filter for any entries that match the new framework selected.
				dislist[0]['disabled'] = true;
			}
			this.set('char.custom.cgedgesnofw', val);
		},	
		
		hindChanged(val) {
			var syshind, charhind, dislist, dislist33, trexcludes, nofwhind;
			syshind = this.get('char.custom.swsyshind');
			charhind = this.get('char.custom.cghind');
			nofwhind = this.get('char.custom.cghindnofw');
		
			
			// Reset all hinderances to available.	
			for (const[k3, v3] of Object.entries(nofwhind)) {
				v3['disabled']=false;
				dislist = Object.values(syshind).filter(slots => slots.name.toString().toLowerCase() == v3['name'].toLowerCase());
				dislist[0]['disabled'] = false;
				if (dislist[0]['trexcludes'].length > 0) {
					trexcludes = this.ck_includes(dislist, syshind, 'hind');
				}					
			}
			
			// What is this really supposed to do now?
			
			for (const[k1, v1] of Object.entries(charhind)) {
				if (!v1['class'].endsWith('*^') && !v1['class'].endsWith('*') && !v1['class'].endsWith('^') ) {
					dislist33 = Object.values(val).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase());
					if (dislist33.length < 1) {
						v1['disabled'] = false;
						dislist = Object.values(syshind).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase());
						dislist[0]['disabled'] = false;
						if (dislist[0]['trexcludes'].length > 0) {
							trexcludes = this.ck_includes(dislist, syshind, 'hind');
						}						
					}
				}
			}
			
			for (const [key, value] of Object.entries(val)) {
				dislist = Object.values(syshind).filter(slots => slots.name.toString().toLowerCase() == value['name'].toLowerCase()); // Convert sysedges to an array and filter for any entries that match the new framework selected.
				dislist[0]['disabled'] = true;
				// Check to see the Hinderance excludes others and mark them as disabled.
				if (dislist[0]['trexcludes'].length > 0) {
					trexcludes = this.ck_excludes(dislist, syshind, 'hind');
				}
			}
			this.set('char.custom.cghindnofw', val);
		},
		
        groupChanged(group, val) {
			var hjtable, tmptable, hjslots, newhjtable={};
			hjslots = this.get('char.custom.hjslots');
			hjtable = this.get('char.custom.hjtables');
		
			if (val) {
				tmptable = Object.values(hjtable).filter(slots => slots.name.toString().toLowerCase() == val.name.toLowerCase()); // Convert hjtables to an array and filter for any entries that match the new framework selected.
				
				if (tmptable.length > 0) {
						tmptable[0]['table'] = val.table;
				} else { // We're looking at hjtable not being populated. Need to cycle through HJSlots to ensure the hjtable object is setup correctly.
					var tmptable1 = {};				
					for (const [key, value] of Object.entries(hjslots)) {
						console.log ('Key: '+key+' Value:'+value);
						tmptable1[key] = {};
						if (val.name == key) {			
							tmptable1[val.name]['table'] = val.table;
							tmptable1[val.name]['name'] = val.name;	
						} else {
							tmptable1[key]['table'] = 'None';
							tmptable1[key]['name'] = key;
						}					
					}
					hjtable = tmptable1;
				}
				this.set ('char.custom.hjtables', hjtable);
          }
		},
		
	}
  
});
