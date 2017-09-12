# vue-shopify-products

> Formats a Shopify CSV to be more manageable

This Vue plugin takes a shopify CSV and converts it into a more freiendly format. Combining products and adding image and product variations as arrays and objects, this plugin allows you to use [Shopify test data](https://github.com/shopifypartners/shopify-product-csvs-and-images) to practice building a shop with Vue.

## Installation

Include the JS in your file:

```
<script type="text/javascript" src="assets/js/vue-shopify-products.js"></script>
```

and `use` the plugin before you initialise Vue:

```
Vue.use(ShopifyProducts);
```

## Usage

This is generally used with a [CSV Parser](https://github.com/okfn/csv.js).

```
new Vue({
  mounted() {
    // "this" inside CSV instance is qequal to that, not vue
    let self = this;
    // // Fetch will not work on local (file:// urls). 
    // // Can use http-sever to run a small node/python/mamp server
    CSV.fetch({
      url: './path/to.csv'
    }).then(function(dataset) {
      let products = self.$formatProducts(dataset);
    });

  }
}).$mount('#app');
```
