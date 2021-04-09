<template>
  <Card :title="title" :subtitle="subtitle">
    <div class="link-card-url-container">
      <a
        ref="url"
        class="url"
        target="_blank"
        rel="noopener noreferrer nofollow"
        :href="baseUrl + keyString"
      >
        {{ urlToShow }}
      </a>
    </div>
    <CardButtonBar
      @download="$emit('download', $event)"
      @copy="$emit('copy', $event)"
    />
  </Card>
</template>

<script lang="ts">
import Card from "@/components/shared/Card.vue";
import CardButtonBar from "@/components/shared/CardButtonBar.vue";
import { animateAddTextInElement } from "@/UIHelpers";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: { Card, CardButtonBar },
})
export default class LinkCard extends Vue {
  @Prop(String) readonly title: string | undefined;
  @Prop(String) readonly subtitle: string | undefined;
  @Prop(String) readonly baseUrl!: string;
  @Prop(String) readonly keyString!: string;

  urlToShow = "";

  mounted() {
    animateAddTextInElement(
      this.baseUrl,
      this.keyString,
      1500,
      (s) => {
        this.urlToShow = s;
      },
      () => {
        this.$emit("animationFinish");
      }
    );
  }
}
</script>

<style lang="scss">
.link-card-url-container {
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 16px;

  & > a {
    overflow-wrap: break-word;
    word-break: break-all;
    color: #1976d2;

    &:visited {
      color: #512da8;
    }
  }
}
</style>
