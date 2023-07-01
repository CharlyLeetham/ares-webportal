import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

	didInsertElement: function() {
	let self = this;
	this.set('updateCallback', function() { return self.onUpdate(); } );
	},

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
		swiconicf = this.get('char.custom.syshind');
		return swiconicf;
	}),

	createperkarray: computed(function() {
		var perkarray=[], i, charhindpoints;
		i = 0;
		charhindpoints = this.get('char.custom.charhindpoints');
		while ( i < charhindpoints) {
			perkarray[i]=[];	
			perkarray[i]['name']= 'Perk '+(i+1);
			i++;
		}
		return perkarray;
	}),

	swriftsperks: computed(function() {
		var swperks;
		swperks = this.get('char.custom.swperks');
		return swperks;
	}),

  hjtables: computed(function() {
    var newhjtables, sysiconicfall, charicf;
    sysiconicfall = this.get('char.custom.sysiconicf');
    charicf = this.get('char.custom.charicf');

    newhjtables = Object.values(sysiconicfall).filter(slots => slots.name.toString().toLowerCase() == charicf['class'].toLowerCase()); // Convert swiconicfall to an array and filter for any entries that match the new framework selected.
    newhjtables = newhjtables[0];

    if (newhjtables) {
      var tmptable=[], hjname, i, hjnumber;
      for (const [key, value] of Object.entries(newhjtables)) {
        if (key.startsWith('hj')) {
          hjname = key.split('_')[0].toLowerCase().trim(); //Take the key name and remove the _ and everything after.
          hjnumber = hjname.replace('hj','');
          tmptable[hjname]=[];
          for (const [k1, v1] of Object.entries(value)) {
            tmptable[hjname]['tablenumber']=hjnumber;
            tmptable[hjname]['details']=[];
            tmptable[hjname]['details']['name']=hjname;
            tmptable[hjname]['details']['table']=v1;
          }
        }
      }
    }

    return (tmptable);
  }),

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

	mergeArrays: function(...arrays) {
		var newarr=[];

		arrays.forEach( array => {
			newarr.push(...array);
		});

		return newarr;
	},

	changedges: function( sysedg, newedgarray, traittype, fw ) {
		// This changes the arrays on the page for Hinderances and Edges based on the Race / ICF that has been changed. Whilst something is returned, the return value is not used.

		/// Passed In: ///
		/// sysedg = All System edges
		/// newedgarray = Edges for selected framework
		/// traittype = Edge or Hinderance
		/// fw = ICF or Race

		var cgtrnewedg=[], i, en, specchar, dislist, exedg, traitclass, loc2, trexcludes, cgtr1=[], ctr, nesize, eesize, swriftstmp, tmplist, finaltraits=[];


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
		// if (traittype == 'hind') {
			// console.log ('Exedg: ');
			// console.log (exedg);
			// console.log ('newedgarray: ');
			// console.log (newedgarray);
			// console.log ('here');
		// }
		///// End Debug /////

		if ( Object.keys(exedg).length > 0 && Object.keys(exedg[0]).length > 0) {
		// If there are edges or hinderances already set on the character, get them back
			i = 0;
			if ( fw=='icf' ) { // If we're looking at changing the Iconic Framework, find out which attributes are marked as Racial features. We want to keep these and remove all the ICF ones)
				for ( const[ed, desc] of Object.entries(exedg) ) {
					///// Debugging /////
					// if ( traittype == 'edge' ) {
						// console.log ('Checking  ICF ');
						// console.log ('Trait Type: '+traittype);
						// console.log ('Exeedg: ');
						// console.log (exedg);
						// console.log ('SysEdg: ');
						// console.log (sysedg);
						// console.log (desc);
					// }
					///// End Debug /////
					en = desc['name'];
					dislist = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the trait list to an array and filter for any entries that match the new traits selected.
					if ( desc['class'].includes('^') && dislist.length > 0 ) {
						cgtrnewedg[i] = [];
						cgtrnewedg[i]['class']=dislist[0]['name']+'^';
						cgtrnewedg[i]['name']=desc['name'];
						cgtrnewedg[i]['rating']=desc['rating'];
						i=i+1;
					}
				}
			} else if ( fw=='race') {	// If we're looking at changing the Race, find out which attributes are marked as ICF features. We want to keep these and remove all the race ones)
				for ( const[ed, desc] of Object.entries(exedg) ) {
					///// Debugging /////
						// console.log ('Checking  Race ');
						// console.log (desc);
						// console.log (sysedg);
					///// End Debug /////
					en = desc['name'].toLowerCase();

					///// Debugging /////
						// console.log ('Checking  Race ');
						// console.log (desc['name']);
						// console.log (traittype);
					///// End Debug /////

					dislist = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the trait list to an array and filter for any entries that match the new traits selected.

					///// Debugging /////
						// console.log ('Dislist: ');
						// console.log ( dislist );
					///// End Debug /////
					if ( desc['class'].includes('*') && dislist.length > 0 ) {
						// console.log (desc+' class includes *');
						cgtrnewedg[i]=[];
						cgtrnewedg[i]['class']=dislist[0]['name']+'*';
						cgtrnewedg[i]['name']=desc['name'];
						cgtrnewedg[i]['rating']=desc['rating'];
						i=i+1;
					}
				}
			}
		}


		// At this point, cgtrnewedg is a nicely formatted array of the traits we want to keep. (Edges or Hinderances depending on the cycle).

		/// Debugging /////
		// if (traittype == 'edge') {
			// console.log (sysedg);
			// console.log ('New Edges: ');
			// console.log (traittype);
			// console.log (fw);
			// console.log ('cgtrnewedg:');
			// console.log (cgtrnewedg);
			// console.log ('New Edge Array: ');
			// console.log (newedgarray);
		// }
		///// End Debug /////


		//Get all the details for the New Edges passed in. This is need to do the combination of the arrays below.

		if ( newedgarray && newedgarray[0] != null ) {
			// console.log ( newedgarray );
			var ctr1=0;
			for ( const [key, value] of Object.entries(newedgarray) ) {  // We need to find matching traits and apply the appropriate special characters to the end.
				en = value.split(specchar)[0].toLowerCase().trim(); // Take the trailing * or ^ from the edge for I/F's
				tmplist = Object.values(cgtrnewedg).filter(slots => slots.name.toString().toLowerCase() == en);
				dislist = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the trait list to an array and filter for any entries that match the new traits selected.

				/// Debugging /////
				// console.log ('Dislist');
				// console.log (dislist);
				// console.log ('TmpList');
				// console.log (tmplist);
				// console.log ('Traittype: ' + traittype);
				///// End Debug /////
				if ( Object.keys(tmplist).length == 0 && Object.keys(dislist).length > 0 ) { // If there's no match in the existing edge array, we want this entry
					cgtr1[ctr1]=[];
					cgtr1[ctr1]['class'] = value;
					// cgtr1[ctr1]['name'] = dislist[0]['name'].toString().toLowerCase();
					cgtr1[ctr1]['name'] = dislist[0]['name'].toString();
					cgtr1[ctr1]['rating'] = dislist[0]['desc'];
					// Set this trait as disabled in the drop list for traits.
					dislist[0]['disabled'] = true;
					ctr1++;
				} else if ( Object.keys(tmplist).length == 0 && Object.keys(dislist).length == 0 ) {
					// console.log ('Trait: ' + en + ' not found in ' + traittype + ' file' );
				} else if ( Object.keys(dislist).length > 0 ) { // If there is a match or not
					// set disabled to true
					dislist[0]['disabled'] = true;
						if ( traittype == 'hind' ) { // What are we checking for here exactly?????
							trexcludes = this.ck_excludes(dislist, sysedg, traittype);
						}
						loc2 = dislist[0]['name']; // Get the nice name from System Edges file
						loc2 = loc2+'*^'; // Add the right special characters to it.
						tmplist[0]['class'] = loc2;
				}

			}

			/// Debugging /////
			// if (traittype == 'edge') {
				// console.log ('cgtrnewedg');
				// console.log (cgtrnewedg);
				// console.log ('cgtr1');
				// console.log (cgtr1);
			// }
			///// End Debug /////
		}

		finaltraits = this.mergeArrays(cgtr1,cgtrnewedg);

		// sort the data
		finaltraits.sort(function (x, y) {
			let a = x.name.toLowerCase(),
				b = y.name.toLowerCase();
			return a == b ? 0 : a > b ? 1 : -1;
		});

		if ( traittype == 'edge' ) {
			// console.log ( 'here' );
			// console.log ( 'Sysedg' );
			// console.log ( sysedg );
			// console.log ( 'Final Traits' );
			// console.log ( finaltraits );
			this.set('char.custom.sysedges', sysedg); //Send the new dropdown back to the page.
			this.set('char.custom.cgedges', finaltraits); //Send the new array back to the page for nice display.
			this.set('char.custom.cgedgesfw', finaltraits); //Send the new array back to the page for nice display.
		} else {

      console.log ( 'Final Traits' );
			console.log ( finaltraits );
			this.set('char.custom.syshind', sysedg); //Send the new dropdown back to the page.
			this.set('char.custom.cghind', finaltraits); //Send the new array back to the page for nice display.
			this.set('char.custom.cghindfw', finaltraits); //Send the new array back to the page for nice display.
		}
		return (finaltraits);
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
		var i = 0, dd = 0, dislist44, evalrace=[], dragonrace=[], en1, complrace, newedgarray, newhindarray, newcyberarray, comptypearray=[], comptypearray2=[], comptypearray3=[], comptypearray4=[], lowedgarray, racecompl, fullsys, listsys, rppe, risp, rnsb, rcyber, rbp=[], dragon, hascyberslots, chargenslots, norace;

		if (traittype == 'icf') {
			fullsys = swraceall;
			listsys = swrace;
		} else {
			fullsys = swiconicfall;
			listsys = swiconicf;
		}

		newedgarray = chosenifarray[0].edges; // Select the edges for the new if

		///// Debugging /////
		// if (traittype == 'icf' ) {
			// console.log ( newedgarray );
			// console.log ( newedgarray.length );
			// if ( newedgarray[0] == null ) {
				// console.log('here');
			// }
			//console.log ( chosenifarray );
		// }
			 if ( traittype == 'race' ) {
				 //console.log ( swraceall );
				 //console.log ( swiconicfall );
				 //console.log ( swrace );
				 //console.log ( swiconicf );
				 //console.log ( chosenifarray );
				 //console.log ( newval );
			 }
		///// End Debug /////

		if ( newedgarray && newedgarray[0] != null ) {
			lowedgarray = newedgarray.map(newedgarray => newedgarray.toLowerCase());
		}
		newhindarray = chosenifarray[0].hinderances; // Select the hinderances for the new if
		newcyberarray = chosenifarray[0].cybernetics; // Select the cybernetics for the new if
		racecompl = chosenifarray[0].complications;

		///// Debugging /////
			if ( traittype == 'icf' ) {
				// console.log ( newhindarray );
				// console.log ( newcyberarray );
				// console.log ( racecompl );
				// console.log ( lowedgarray );
		  }
		///// End Debug /////

		comptypearray = ['ab miracles*', 'ab magic*']; // Used for PPE check
		comptypearray2 = ['ab psionics*']; // Used for psionics check
		comptypearray3 = ['power armor jock*']; // Used for cyber check
		comptypearray4 = ['juicer', 'crazy']; // Used for Bizarre Physiology
		rppe = "Restricted Path PPE^";
		risp = "Restricted Path ISP^";
		rcyber = "Cyber Resistant^";
		rnsb = "Non-Standard Build^";
		rbp = ['Inhuman Physiology+^','Inhuman Physiology++^', 'Bizarre Physiology^', 'Alien Physiology^'];
		dragon = "Dragon*";
    	norace = "No Race";

		if ( traittype == 'icf' ) {

      if ( racecompl ) {
  			var dragon_check = racecompl.includes(dragon); //see if the race has the value
        var norace_check = racecompl.includes(norace);
      }

      if ( !dragon_check || !norace_check ) {
    			for ( const [key, value] of Object.entries( fullsys ) ) { //Loop through the race values. We want to know which races an Iconic Framework can't have.
    				complrace = value.hasOwnProperty( 'complications' );
    				///// Debugging /////
    				//console.log ( 'value: ' );
    				//console.log ( value );
            //console.log ( value.edges );
    				// console.log ( value.name );
    				///// End Debug /////


    				if ( complrace ) { //Complications exist on the character
    					for ( const [k, v] of Object.entries( value.complications ) ) {
    						///// Debugging /////
    							// console.log ('v: '+v);
    						///// End Debug /////

    						if ( v && lowedgarray ) {
    							var ppe_check = v.includes( rppe ) // see if the race has the value
    							var isp_check = v.includes( risp ) //see if the race has the value
    							var cyber_check = v.includes( rcyber ) //see if the race has the value
    							var nsb_check = v.includes( rnsb ) //see if the race has the value
    							//var bp_check = v.includes( rbp ) //see if the race has the value

    							///// Debugging /////
    							// console.log( 'Key: ' +key );
    							// console.log( 'Val: ' );
    							// console.log ( value );
    							// console.log ( 'Name: '+ value.name );
    							// console.log ( 'Complication: '+ v );
    							// if ( value.name == 'DNorr' ) {
    								// console.log ( 'PPE: '+ ppe_check );
    								// console.log ( 'ISP: '+isp_check );
    								// console.log ( 'Cyber: '+cyber_check );
    								// console.log ( 'NSB: '+nsb_check );
    								// console.log ( 'BP: ' +bp_check );
    								// console.log ( 'Dragon: '+dragon_check );
    							// }
    							///// End Debug /////


    							if ( ( Array.isArray( value.complications ) && value.complications[0] !== null ) && value.complications.includes( dragon ) ) {  //If the framework has a complication of Dragon, do this.
    								if ( !dragonrace.includes( value.name ) ) { // If the array dragonrace doesn't already include this framework, include this race in the array;
    									dragonrace[dd]=value.name;
    									dd = dd+1;
    								}
    							}

                  if ( (Array.isArray( value.complications ) && value.complications[0] !== null) ) {
                    // Check to see if the complications array includes anything in the bp_check array
                    for ( const [k, v] of Object.entries( value.complications ) ) {
                      var bp_check = rbp.includes(v);
                      if (bp_check == true) {
                        break;
                      }
                    }
                  }

    							if ( ppe_check == true ) {
    								var ppe_test = lowedgarray.some( v => comptypearray.includes( v ) );
    							}

    							if ( isp_check == true ) {
    								var isp_test = lowedgarray.some( v => comptypearray2.includes( v ) );
    							}

    							if ( nsb_check == true ) {
    								var nsb_test = lowedgarray.some( v => comptypearray3.includes( v ) );
    							}

    							if ( bp_check == true ) {
    								var bp_test = true;
    							}

    							if ( ppe_test==true || isp_test==true || nsb_test == true || bp_test == true || cyber_check == true ) {
    								if ( !evalrace.includes( value.name ) ) {
    									evalrace[i]=value.name;
    									i = i+1;
    								}
    							}
    						}
    					}
    				}	// end for loop
          } // End if not dragon or norace
				var ppe_test = false;
				var isp_test = false;
				var nsb_test = false;
				var bp_test = false;
				var cyber_test = false;
			}
		} else { //trait is Race.
			for ( const [key, value] of Object.entries( fullsys ) ) { //Loop through the race values. We want to know which races an Iconic Framework can't have.

        //console.log ( 'value: '+value.name );
        //console.log ( value.complications );
        //console.log ( value.edges );
				// Check the ICF complications to see if it has Dragon.
				if ( ( Array.isArray( value.complications ) && value.complications[0] !== null ) && value.complications.includes( dragon ) ) {  //If the framework has a complication of Dragon, do this.
					if ( !dragonrace.includes( value.name ) ) { // If the array dragonrace doesn't already include this framework, include this race in the array;
						dragonrace[dd]=value.name;
						dd = dd+1;
					}
					var dragon_check_icf = true //Tell us that the ICF allows the use of Dragon.
					if ( !evalrace.includes(value.name) ) {
						//console.log ('Value.Name: '+value.name);
						evalrace[i] = value.name;
						i=i+1;
					}
				}

        if ( (Array.isArray( value.complications ) && value.complications[0] !== null) ) {
          // Check to see if the complications array includes anything in the bp_check array
          for ( const [k, v] of Object.entries( value.complications ) ) {
            var bp_check = rbp.includes(v);
          }
          if (bp_check == true) {
            break;
          }
        }

				if ( racecompl ) {
					// If there are racecomplications, check to see if the Race includes things that the IF can't have //
					var ppe_check = racecompl.includes(rppe) // see if the race has the value
					var isp_check = racecompl.includes(risp) //see if the race has the value
					var cyber_check = racecompl.includes( rcyber ) //see if the race has the value
					var nsb_check = racecompl.includes(rnsb) //see if the race has the value
					//var bp_check = racecompl.includes(rbp) //see if the race has the value
					var dragon_check = racecompl.includes(dragon) //see if the race has the value

						if ( value.edges  ) { //If complications exist for the race chosen, check the edges for the ICF and make sure they are disabled
							for ( const [k, v] of Object.entries( value.edges ) ) {
								if ( v ) {  // This checks that there isn't a blank entry.
									if ( ppe_check == true ) {
										var ppe_test = comptypearray.includes(v.toLowerCase());
									}

									if ( isp_check == true ) {
										var isp_test = comptypearray2.includes(v.toLowerCase());
									}

									if ( nsb_check == true ) {
										var nsb_test = comptypearray3.includes(v.toLowerCase());
									}

									if ( bp_check == true ) {
										var bp_test = true;
                    if ( value.name == 'Juicer') {

                    }
									}

									if ( cyber_check == true ) {
										if ( value.hasOwnProperty( 'chargen_points' ) || value.hasOwnProperty( 'cyberslots' ) ) {
											if ( value.hasOwnProperty( 'chargen_points' ) ) {
												chargenslots = value.chargen_points;
												if ( chargenslots.hasOwnProperty( 'cyber_slots' ) ) {
													var cyber_test = true;
												}
											}

											if ( value.hasOwnProperty( 'cybernetics' ) ) {
												var cyber_test = true;
											}
										}
									}

                  //if ( newval == "d'norr" ) {
                  //  console.log ( 'PPE: '+ ppe_test );
                  //  console.log ( 'ISP: '+isp_test );
                  //  console.log ( 'Cyber: '+cyber_test );
                  //  console.log ( 'NSB: '+nsb_test );
                  //  console.log ( 'BP: ' +bp_test );
                  //  console.log ('------');
                  //}

									if ( ppe_test == true || isp_test == true || nsb_test == true || bp_test == true || cyber_test == true || dragon_check_icf == true ) {
										// We need to determine if the IF has this edge
										if ( !evalrace.includes(value.name) ) {
											evalrace[i] = value.name;
											i=i+1;
										}
									}
								} //if (v)
								var ppe_test = false;
								var isp_test = false;
								var nsb_test = false;
								var bp_test = false;
								var cyber_test = false;
                var dragon_check_icf = false;
							} // For Loop
						} // Check Edges
					} //Race complication
				} // For loop
				var dragon_check_icf = false;
		} //Traittype


  //console.log (evalrace);
    // We pull No Race and Dragon Races out as seperate checks as the check is a bit easier.

    // We want to see if the ICF doesn't need a race. If it doesn't, we need to mark all RACES as disabled so they can't be chosen.
    if ( norace_check ) {
      dislist44 = Object.values( listsys );  // Convert the framework list to an array
			for (const [k1, v1] of Object.entries(dislist44)) { // Work through the array of races
        if ( v1['class'] != "none" ) {  // The only entry we want enabled is the 'None' one to be able to reset things as needed.
          v1['disabled'] = true;
        } else {
          v1['disabled'] = false;
        }
      }
      return;
    }

    // Is this a Dragon Race or Dragon ICF?
		if ( dragon_check ) {
			dislist44 = Object.values( listsys );  // Convert the framework list to an array
			for (const [k1, v1] of Object.entries(dislist44)) { // Work through the system list of ICF or Race
			  if ( dragonrace.includes( v1['class'] ) ) { //If the dragonrace array contains the name of this ICF or Race, set it to disbled so it can't be chosen.
					v1['disabled'] = false //Set disabled for this element to false
				} else {
					v1['disabled'] = true //Set disabled for this element to false
				}
			}
			return;
		}

    // Now more generic tests.
		if ( evalrace ) { //Have we found an ICF or Race with a complication, edge or hinderance that excludes others being selected?
			dislist44 = Object.values( listsys );  // Convert the framework list to an array
			for (const [k1, v1] of Object.entries(dislist44)) { //Cycle through the array
				if ( evalrace.includes( v1['class'] ) ) { // Does the Framework match the name of the Race or ICF we're testing?
					v1['disabled'] = true //Set disabled for this element to false
				} else {
					v1['disabled'] = false //Set disabled for this element to false
				}
			}
		}
		return;
	},

	// Reset ICF or Race to none.
	fwreset: function(fwname, fw) { //Array of system settings, what we're working on (Race or ICF)

		// **** //
		// fwname: The framework array that we need to check
		// fw: The framework that is being reset.
		// **** //

		var cgedgfw, cghindfw, dislist, exedg, exhind, i, cgtr1=[], cgtr2=[], newclass, hjslots, hjtables, curricf, currrace, currsysedges, dislist33;
		var currsysedges = this.get( 'char.custom.sysedges' );
		var currsyshinderances = this.get( 'char.custom.syshind' );
		exedg = this.get('char.custom.cgedges');
		exhind = this.get('char.custom.cghind');
		curricf = this.get('char.custom.charicf');
		currrace = this.get('char.custom.charrace');

		dislist = Object.values( fwname ).filter( slots => slots.disabled.toString().toLowerCase() == 'true' );
		// Convert the framework list to an array and filter for any entries that are disabled.  This allows us to reset disabled entries because they are now all available

		for (const [key, value] of Object.entries(dislist)) {
			value['disabled'] = false //Set disabled for this element to false. Anything can be chosen.
		}

		// Get what edges and hinderances are set on the character already.

		//Reset Edges
		i = 0;

		// If both Race and ICF are set to none, reset everything

		if ( curricf['class'].toLowerCase() == 'none' && currrace['class'].toLowerCase() == 'none' ) {
			cgtr1[i] = [];
			cgtr2[i] = [];
			dislist33 = Object.values( currsysedges ).filter( slots => slots.disabled.toString() == 'true' );
			for ( const [k1, v1] of Object.entries( dislist33 ) ) {
				v1.disabled = false;
			}

			dislist33 = Object.values( currsyshinderances).filter( slots => slots.disabled.toString() == 'true' );
			for ( const [k1, v1] of Object.entries( dislist33 ) ) {
				v1.disabled = false;
			}
		} else {
			// Reset displayed selected attributes for ICF set to None
			if ( curricf['class'].toLowerCase() == 'none' && Object.keys(exedg).length > 1 ) {

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

				var dislist_exedg = Object.values( exedg ).filter( slots => slots.class.endsWith('*') );
				dislist33 = Object.values( currsysedges ).filter( slots => slots.disabled.toString() == 'true' );
				for ( const [k1, v1] of Object.entries( dislist33 ) ) {
					for ( const [k3, v3] of Object.entries( dislist_exedg ) ) {
						if ( v1.name.toLowerCase() == v3.name ) {
							v1.disabled = false;
						}
					}
				}
			}

			// Reset displayed attributes for Race set to None
			if ( currrace['class'].toLowerCase() == 'none' && Object.keys(exedg).length > 1 ) {
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

				var dislist_exedg = Object.values( exedg ).filter( slots => slots.class.endsWith('^') );
				dislist33 = Object.values( currsysedges ).filter( slots => slots.disabled.toString() == 'true' );
				for ( const [k1, v1] of Object.entries( dislist33 ) ) {
					for ( const [k3, v3] of Object.entries( dislist_exedg ) ) {
						if ( v1.name.toLowerCase() == v3.name ) {
							v1.disabled = false;
						}
					}
				}
			}

			//Reset Hinderances
			i = 0;

			// Reset displayed selected attributes for ICF set to None
			if ( curricf['class'].toLowerCase() == 'none' && Object.keys(exhind).length > 1 ) {

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

				var dislist_exhind = Object.values( exhind ).filter( slots => slots.class.endsWith('*') );
				dislist33 = Object.values( currsyshinderances).filter( slots => slots.disabled.toString() == 'true' );
				for ( const [k1, v1] of Object.entries( dislist33 ) ) {
					for ( const [k3, v3] of Object.entries( dislist_exhind ) ) {
						if ( v1.name.toLowerCase() == v3.name ) {
							v1.disabled = false;
						}
					}
				}
			}

			// Reset displayed selected attributes for Race set to None

			if ( currrace['class'].toLowerCase() == 'none' && Object.keys(exhind).length > 1 ) {
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
				var dislist_exhind = Object.values( exhind ).filter( slots => slots.class.endsWith('^') );
				dislist33 = Object.values( currsyshinderances).filter( slots => slots.disabled.toString() == 'true' );
				for ( const [k1, v1] of Object.entries( dislist33 ) ) {
					for ( const [k3, v3] of Object.entries( dislist_exhind ) ) {
						if ( v1.name.toLowerCase() == v3.name ) {
							v1.disabled = false;
						}
					}
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
			syshind = this.get('char.custom.syshind');// Get all the System Hinderances
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
			// console.log ('Newedg:' + newedg);
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
     		 var hjnumber;
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

      //console.log (tmptable);
			this.set('char.custom.hjslots', tmptable); //Send the new array back to the page for nice display.

			//Reset Heroes Journeys already set on the character
			hjtables = [];
			this.set('char.custom.hjtables', hjtables);  //Set Heroes Journey


			//Modify the CGen counters
			charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
			cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.

			newifpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == newval);
      // Convert charcgp to an array and filter for any entries that match the new framework selected.

      //Loop through the init counter values. We use these as our baseline to measure changes applied by ICF.
			for (const [key, value] of Object.entries(cgslots)) {
				resetifpoints = newifpoints.filter(slots => slots.name.toString() == value['class']);
        // Test to see if the slot is modified by the Iconic Framework.

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
			syshind = this.get('char.custom.syshind');// Get all the System Hinderances
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
			newhind = this.changedges(syshind, newhindarray, 'hind', 'race');
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

			/////  Debugging /////
			// console.log ('Val: ');
			// console.log (val);
			// console.log ('SysEdges: ');
			// console.log (sysedges);
			// console.log ('Charedges: ');
			// console.log (charedges);
			// console.log ('Charedgesall: ');
			// console.log (charedgesall);
			// console.log ('Nonfwedges: ');
			// console.log (nonfwedges);
			///// End Debug /////

			// Reset the non-framework and race edges on the character.
			if ( nonfwedges ) {
				for ( const[k3, v3] of Object.entries( nonfwedges ) ) {
					v3['disabled']=false;
					dislist = Object.values(sysedges).filter(slots => slots.name.toLowerCase() == v3['name'].toLowerCase());
					dislist[0]['disabled'] = false;
					/////  Debugging /////
					//	console.log ('Dislist: ');
						//console.log (dislist);
					///// End debug /////
					if ( dislist[0]['trexcludes'].length > 0 ) {
						trexcludes = this.ck_includes(dislist, sysedges, 'edge');
					}
				}
			}

			if ( charedges || ( charedges[0] && charedges[0].length > 0 ) ) {
				for ( const[k1, v1] of Object.entries( charedges ) ) {
					/////  Debugging /////
						// console.log ('Here2');
					///// End debug /////
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
			}

			if ( val ) {
				for ( const [key, value] of Object.entries(val) ) {
					/////  Debugging /////
						// console.log ('Here3');
					///// End debug /////
					value['disabled']=false;
					dislist = Object.values(sysedges).filter(slots => slots.name.toString().toLowerCase() == value['name'].toLowerCase()); // Convert sysedges to an array and filter for any entries that match the new framework selected.
					dislist[0]['disabled'] = true;
				}

        // console.log ('Dislist: ');
        // console.log ('dislist');
        // console.log ('Val: ');
        // console.log ('val');
			}
			this.set( 'char.custom.cgedgesnofw', val );

		},

		hindChanged( val ) {
			var syshind, charhind, dislist, dislist33, trexcludes, nofwhind, maxhindcounter, hindcounter, points1, newcharperks;
			points1 = 0;  // Use this to add up the number of perks from hinderances
			syshind = this.get('char.custom.syshind'); // System Hinderances
			charhind = this.get('char.custom.cghind'); // Hinderances set on the character by the frameworks
			nofwhind = this.get('char.custom.cghindnofw'); // Hinderances chosen by the character
      		maxhindcounter = 4; //This might get set by a YAML later. Maximum number of hinderance points that can be converted to Perks.
			hindcounter = this.get('char.custom.charhindpoints'); // Get the points set on the characters - what use is this (19 Feb 2023)
			newcharperks = this.get('char.custom.swperks'); //System Perks

			//Calculate the Perk Points
			for ( const[k1, v1] of Object.entries(val) ) {
					if ( v1.hasOwnProperty('points') ) {
						points1 = points1+v1['points'];
					} else if ( v1.hasOwnProperty('hind_points' )) {
						points1 = points1+parseInt(v1['hind_points']);
					}
			}

			if (points1 > maxhindcounter) {
				points1 = maxhindcounter;
			}

			/* Modify this to update the Perk Tables 

			/* Update the Perk Tables
			Table is returned as an array:
			name: The name of the Perk
			cost: the cost of the perk
			newperktables - an array to display the system perks
			newcharperks - is the system perks from the yml
			*/

			// Change the options displayed to the player
			var newperktables = [], x, ctr, perkname;


			//We need to convert the System Perks (newcharperks) to an array that can be used in the dropdowns on the CGen page.
			for (x=0; x < points1; x++) {
				ctr = x+1; //setup a counter for the Perks
				perkname = "Perk_"+ctr; //Set the Perkname
				newperktables[perkname]=[]; //Setup an array with the index of Perkname
				var z, ctr1;
				z = 0;
				for ( const[k1, v1] of Object.entries(newcharperks) ) {
				// Loop through the System Perks and the values.	
					newperktables[perkname][z]=[]; //Create an array for each system perks
					Object.entries(v1).forEach(([k2, v2]) => {
						//Loop through the values of the system perks array to 'flatten' it a bit
						newperktables[perkname][z][k2] = v2;
					});
					newperktables[perkname][z]['perknumber'] = ctr; //Set the field perknumber equal ctr. This is needed for val changing later.
					z++;
				}
			}

			console.log ('Initial Setup:');
			console.log (newperktables);

			this.set('char.custom.charperkpoints', newperktables); //Send the new array back to the page for nice display.

			// Check the hinderances that are set by the player (not the frameworks) and determine which other hinderances need to be changed.
			if ( nofwhind ) {
				// Check the existing hinderances on the character, if they aren't race or ICF specific, determine if we are removing or adding. Change the 'disabled' setting accordingly.
				for ( const[k1, v1] of Object.entries(nofwhind) ) {
					if (!v1['name'].endsWith('*^') && !v1['name'].endsWith('*') && !v1['name'].endsWith('^') ) { //This check is probably redundant but it doesn't hurt to leave it in.  It's looking for Hinderances that are set by the ICF or Race. Theoretically, if we're already in this loop, they are none of those.
						dislist33 = Object.values(val).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase()); // Check to see if the selected hinderances are already set on the character
						if (dislist33.length < 1) { //If not set, then go through and disable the appropriate hinderances
						v1['disabled'] = false;
						dislist = Object.values(syshind).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase());
						dislist[0]['disabled'] = false;
						if (dislist[0]['trexcludes'].length > 0) {
							trexcludes = this.ck_includes(dislist, syshind, 'hind');
						}
						}
					}
				}
			}

	  		// Now compare what was previous set on the character to what they've selected. If they've removed a trait, make sure it and it's exclusions are set to enabled.

			if ( charhind ) {
			// Check the existing hinderances on the character, if they aren't race or ICF specific, determine if we are removing or adding. Change the 'disabled' setting accordingly.
				for ( const[k1, v1] of Object.entries(charhind) ) {
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
			}

      		//Cycle through the values selected by the player and set the other hinderances that are excluded to disabled.
			if ( val ) {
					for (const [key, value] of Object.entries(val)) {
						value['disabled']=false;
						//console.log ( hindcounter );
						dislist = Object.values(syshind).filter(slots => slots.name.toString().toLowerCase() == value['name'].toLowerCase()); // Convert sysedges to an array and filter for any entries that match the new framework selected.
						dislist[0]['disabled'] = true;
						if (dislist[0]['trexcludes'].length > 0) {
							trexcludes = this.ck_excludes(dislist, syshind, 'hind');
						}
					}
				}
			this.set('char.custom.cghindnofw', val); // Set the chosen hinderances back to the character object
			this.set('char.custom.charhindpoints', points1); // Set the number of hindpoints the character can spend on their object
		},



		groupChanged(group, val) {
				var hjtable, tmptable, hjslots, newhjtable={};
				hjslots = this.get('char.custom.hjslots');  //The Heroes Journey that can be chosen based on the ICF.
				hjtable = this.get('char.custom.hjtables'); //The Heroes Journey already selected and saved

				if (val) {

					//Find out if there are existing entries on the character already				
					tmptable = Object.values(hjtable).filter(slots => slots.name.toString().toLowerCase() == val.name.toLowerCase()); // Convert hjtables to an array and filter for any entries that match the new framework selected.

					if (tmptable.length > 0) {
							tmptable[0]['table'] = val.table;
					} else { // We're looking at hjtable not being populated. Need to cycle through HJSlots to ensure the hjtable object is setup correctly.
						var tmptable1 = {};
						for (const [key, value] of Object.entries(hjslots)) {
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
					console.log('hjtable');
					console.log(hjtable);
					this.set ('char.custom.hjtables', hjtable);
			}
		},

		perkchanged(group, val) {
			var perktable, tmptable, perkslots, newperktable={}, perkname;
			perktable = this.get('char.custom.charperks'); //The Perks allowed on the character
			perkslots = this.get('char.custom.perkslots');  //THe Perks set on the character
			console.log (group);

			/* Val returns:
			cost
			name
			perknumber

			Need to return an array:
			[perkname][x][name]
			[perkname][x][cost]
			[perkname][x][perknumber]
			*/
			var valtable=[], k1, v1, k2, v2, z, perkname;
			z=0;
			console.log(val);
			for ( const[k1, v1] of Object.entries(val) ) {
				valtable[k1]=v1;									
			}		
			
			console.log ('Valtable');
			console.log (valtable);

			if (val) { //Player has selected a perk

				//Find out if there are existing entries on the character already
//				if (perkslots) {	
//					tmptable = Object.values(perkslots).filter(slots => slots.name.toString().toLowerCase() == val.name.toLowerCase()); // Convert perktable to an array and filter for any entries that match the new framework selected.
//				}
				//Are there existing entries on the record?
//				if (tmptable.length > 0) {
					//Yes, then update it
//					tmptable[0]['table'] = val.table;
//				} else { 
					var tmptable1={};
					for (const [key, value] of Object.entries(perktable)) {
						tmptable1[key] = {};
						if (val.name == key) {
							tmptable1[val.name]['name'] = val.name;
							tmptable1[val.name]['cost'] = val.cost;
							tmptable1[val.name]['perknumber'] = val.perknumber;							
						} else {					
							tmptable1[key]['Name'] = 'None';
							tmptable1[key]['cost'] = key;
						}
					}
					perkslots = tmptable1;
//				}
			}
			console.log('perkslots');
			console.log(perkslots);
			this.set ('char.custom.perkslots', perkslots);
		}
	},

	onUpdate: function() {
	// Return a hash containing your data.  Character data will be in 'char'.  For example:
	//
	// return { goals: this.get('char.custom.goals') };
  // var myvar = this.get('char.custom.cgedges' );
  // console.log( myvar );
	return { iconicf: this.get('char.custom.charicf'), race: this.get('char.custom.charrace'), cgedges: this.get('char.custom.cgedges'), cgedgesnofw: this.get('char.custom.cgedgesnofw'), cghind: this.get('char.custom.cghind'), cghindnofw: this.get('char.custom.cghindnofw'), charhindpoints: this.get('char.custom.charhindpoints'), hjtables: this.get('char.custom.hjtables') };
	}
});
