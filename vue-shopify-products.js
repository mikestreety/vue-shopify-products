const ShopifyProducts = {
  install(Vue) {

    let generateSlug = function(path) {
      return path.toLowerCase()
        .replace(/^\/|\/$/g, '')
        .replace(/ /g,'-')
        .replace(/\//g,'-')
        .replace(/[-]+/g, '-')
        .replace(/[^\w-]+/g,'');
    }

    Vue.prototype.$formatProducts = function(payload) {
      let headers = payload.fields,
        products = [];

      for(let product of payload.records) {
        let output = {};

        headers.forEach(function(header, index) {
          output[generateSlug(header)] = product[index];
        });
        products.push(output)
      }

      let variations = {};

      for(let product of products) {
        let handle = product.handle;
        let p = variations[handle];
        // console.log(product);
        if(!variations[handle]) {
          p = {
            title: product.title,
            body: product['body-html'],
            handle: handle,
            vendor: product.vendor,
            type: product.type,
            tags: product.tags,
            images: [],
            variations: {}
          };

          if(product['image-src']) {
            p.images.push({
              source: product['image-src'],
              source: product['image-alt-text']
            });
          }

          if(product['option1-name']) {
            p.variations = {
              title: product['option1-name'],
              items: []
            }
          }
        }

        p.variations.items.push({
          title: product['option1-value'],
          barcode: product['variant-barcode'],
          comaprePrice: product['variant-compare-at-price'],
          grams: product['variant-grams'],
          quantity: product['variant-inventory-qty'],
          price: product['variant-price'],
          shipping: product['variant-requires-shipping'],
          sku: product['variant-sku'],
          taxable: product['variant-taxable'],
        });

        variations[handle] = p;
      }
      return variations;
    }
  }
};
