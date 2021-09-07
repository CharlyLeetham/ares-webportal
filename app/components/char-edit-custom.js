import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  
  didInsertElement: function() {
    this._super(...arguments);
    let self = this;
    this.set('updateCallback', function() { return self.onUpdate(); } );
  },
  
  onUpdate: function() {
    // Return a hash containing your data.  Character data will be in 'char'.  For example:
    // 
    // return { goals: this.get('char.custom.goals') };
	// return { charicf: this.get('char.custom.charicf') };
	// return { charrace: this.get('char.custom.charrace') };
  }
});
