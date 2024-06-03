<template>
  <div class="w-full h-64"></div>
</template>
<script>
import DG from "2gis-maps";
export default {
  name: 'TwoGisMap',
  data() {
    return {
      map: null,
      stores: [
        {
          lng: 43.228816,
          lat: 76.95282
        },
        {
          lng: 43.191684,
          lat: 76.882175,
        }
      ]
    }
  },
  mounted() {
    this.map = new DG.map(this.$el, {
      'center': [43.226415, 76.913379],
      'zoom': 11,
      "geoclicker":true,
    });

    this.stores.forEach(el => {
      DG.marker([
        el.lng, el.lat
      ]).addTo(this.map)
    })
  },
  beforeDestroy() {
    if (this.map) this.map.remove();
  }
}
</script>