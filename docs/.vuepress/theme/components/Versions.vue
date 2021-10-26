<template>
    <nav class="nav-versions nav-links" >
      <!-- user links -->
      <nav class="nav-item" >
        <DropdownLink :item="item"></DropdownLink>
      </nav>
  </nav>
</template>

<script>
import DropdownLink from '@theme/components/DropdownLink.vue';

export default {
  name: 'Versions',
  components: {
    DropdownLink
  },
  methods: {
    addLatest(version) {
      if (version === this.$page.latestVersion) {
        return `${version} (Current)`;
      }

      return version;
    },
    getLink(version) {
      const pathWithoutVersion = this.$route.path.replace(/^\/(\d+\.\d+|next)/, '');

      if (version === this.$page.latestVersion) {
        return `/docs${pathWithoutVersion}`;
      }

      return `/docs/${version}${pathWithoutVersion}`;
    }
  },
  computed: {
    item() {
      return {
        text: this.addLatest(this.$page.currentVersion),
        items:
          [
            ...this.$page.versions.map(v => ({
              text: `${this.addLatest(v)}`,
              link: this.getLink(v),
              target: '_self',
              isHtmlLink: true
            }))
          ]
      };
    }
  }
};
</script>

<style lang="stylus">
.nav-versions
  margin-right 1.5rem
  display inline-block
  position relative
  top -1px
  text-transform capitalize

  .dropdown-title {
    text-transform capitalize
  }

  .icon.outbound
    display none

  .dropdown-wrapper
    height 1.8rem

  .dropdown-wrapper .nav-dropdown
    min-width 150px
    height auto !important
    box-sizing border-box
    max-height calc(100vh - 2.7rem)
    overflow-y auto
    position absolute
    top 100%
    left 0
    background-color #fff
    padding 0.6rem 0
    border 1px solid #ddd
    border-bottom-color #ccc
    text-align left
    border-radius 0.25rem
    white-space nowrap
    margin 0
.dropdown-wrapper .dropdown-title .arrow, .dropdown-wrapper .mobile-dropdown-title .arrow
  margin-left 0.1rem

</style>
