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
	

  didInsertElement: function() {
    let self = this;
    this.set('updateCallback', function() { return self.onUpdate(); } );
  },
  
  onUpdate: function() {
    // Return a hash containing your data.  Character data will be in 'char'.  For example:
    // 
    // return { goals: this.get('char.custom.goals') };
	return { iconicf: this.get('char.custom.chariconicf'), race: this.get('char.custom.charrace')};
  },
  
  
	actions: {
		iconicfChanged(val) {
			var charif, charcg;
			charif = this.get('char.custom.chariconicf');
			this.set('char.custom.chariconicf', val);		
			document.getElementById("inp-stats_points").value = 'testing'
			let list = [];
			charcg = this.get('char.custom.cgpoints');
			//console.log(charcg);
			//this.get('char.custom.cgpoints').forEach(function(g) {
			  //list.push({ value: g });
			//});
			//console.log(list);
			//list.forEach(element => console.log(element));	
			//get back the chargen points for the iconicframework
			//get the current chargen points.
			//add the if points to the current points
			//update each of the input fields.

		},
		
		raceChanged(val) {
			var charrace;
			charrace = this.get('char.custom.charrace');
			this.set('char.custom.charrace', val);
		}
	}
  
});
