const ShopifyProducts = {
	install(Vue) {
		let generateSlug = function(path) {
			return path
				.toLowerCase()
				.replace(/^\/|\/$/g, '')
				.replace(/ /g, '-')
				.replace(/\//g, '-')
				.replace(/[-]+/g, '-')
				.replace(/[^\w-]+/g, '');
		};

		Vue.prototype.$formatProducts = function(payload) {
			// Create an empty products array
			let products = [];

			// Was it generated using CSV parser?
			// https://github.com/okfn/csv.js
			if (payload.fields) {
				let headers = payload.fields;

				for (let product of payload.records) {
					let output = {};

					headers.forEach((header, index) => {
						output[generateSlug(header)] = product[index];
					});

					products.push(output);
				}
			} else {
				// Or was it d3.js?
				for (let product of payload) {
					let output = {};

					Object.keys(product).forEach(key => {
						output[generateSlug(key)] = product[key];
					});

					products.push(output);
				}
			}

			// Create output, ready to group variations
			let output = {};

			// Loop through each one
			for (let product of products) {
				let handle = product.handle,
					item = output[handle];

				// If it's the first one with this handle, create an entry
				if (!item) {
					item = {
						title: product.title,
						body: product['body-html'],
						handle: handle,
						vendor: product.vendor,
						type: product.type,
						tags: product.tags,
						images: [],
						variations: {}
					};

					// Check if a variation exists
					if (product['option1-name']) {
						item.variations = {
							title: product['option1-name'],
							items: []
						};
					}
				}

				// Add any images from itself or variations
				if (product['image-src']) {
					item.images.push({
						source: product['image-src'],
						alt: product['image-alt-text']
					});
				}

				// Add all variations with the same handle it finds
				// Even the first product itself would be a varation
				item.variations.items.push({
					title: product['option1-value'],
					barcode: product['variant-barcode'],
					comaprePrice: product['variant-compare-at-price'],
					grams: product['variant-grams'],
					quantity: product['variant-inventory-qty'],
					price: product['variant-price'],
					shipping: product['variant-requires-shipping'],
					sku: product['variant-sku'],
					taxable: product['variant-taxable']
				});

				// Update the output object
				output[handle] = item;
			}

			return output;
		};
	}
};
