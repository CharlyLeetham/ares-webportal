import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  
	swiconicfsel: computed(function() {
		//let list = [];
		var swiconicf;
		swiconicf = this.get('char.custom.iconicf');
		return swiconicf;
	}), 
	
	swracesel: computed(function() {
		//let list = [];
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
	console.log ('kkkk');
	cgiconicf = char.custom.iconicf;
	console.log (cgiconicf);
	return { iconicf: self.cgiconicf)};
  },
  
  
	actions: {
		iconicfChanged(val) {
			var charif;
			charif = this.get('char.custom.chariconicf');
			this.set('char.custom.chariconicf', val);
		},
		
		raceChanged(val) {
			var charrace;
			charrace = this.get('char.custom.charrace');
			this.set('char.custom.charrace', val);
		}
	}
  
});
