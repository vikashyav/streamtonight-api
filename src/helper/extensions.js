class extensions {

	loadExtensions = () => {
		return new Promise((resolve) => {
			Object.assign(Array.prototype, {
				countWhen(predicate) {
					return this.filter(predicate).length;
				}
			});

			Object.assign(Array.prototype, {
				random() {
					const random = Math.floor(Math.random() * this.length);
					return this[random];
				}
			});

			resolve();
		});
	};
}

export default new extensions();