import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  
	swiconicfsel: computed(function() {
		let list = [];
		this.get('model.char.custom.iconicf').forEach(function(g) {
		  list.push({ value: g });
		});
		return list;
	}), 

    iconicfChanged(val) {
        this.set('model.char.custom.iconicf.value', val.value);
    },
	
  
  didInsertElement: function() {
    let self = this;
    this.set('updateCallback', function() { return self.onUpdate(); } );
  },
  
  onUpdate: function() {
    // Return a hash containing your data.  Character data will be in 'char'.  For example:
    // 
    // return { goals: this.get('char.custom.goals') };
   // return { powers: this.get('char.custom.iconicf')};
  }
});
