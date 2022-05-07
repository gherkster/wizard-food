<template>
  <div class="form-input-container form-rating">
    <icon
      v-for="(star, index) in length"
      :fa-icon="
        index <= currentHighlightedIcon || (currentHighlightedIcon === -1 && index < value) ? 'fa-solid fa-star' : 'fa-regular fa-star'
      "
      size="2xl"
      :key="star"
      hover
      @mouseenter="handleMouseEnter(index)"
      @mouseleave="handleMouseLeave"
      @click="handleClick(star)"
    ></icon>
  </div>
</template>

<script>
import Icon from "@/components/atoms/Icon";

export default {
  name: "Rating",
  components: { Icon },
  props: {
    value: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.currentHighlightedIcon = this.value;
  },
  data: () => ({
    currentHighlightedIcon: -1,
  }),
  methods: {
    handleMouseEnter(index) {
      this.currentHighlightedIcon = index;
    },
    handleMouseLeave() {
      this.currentHighlightedIcon = -1;
    },
    handleClick(star) {
      console.log("star rating: ", star);
      this.$emit("input", { path: this.path, value: star });
    },
  },
};
</script>
