<template>
  <Card :title="title" :subtitle="subtitle">
    <div class="link-card-url-container">
      <a
        ref="url"
        class="url"
        target="_blank"
        rel="noopener noreferrer"
        :href="baseUrl + keyString"
      >
        {{ urlToShow }}
      </a>
    </div>
    <div class="bottom-bar-container">
      <div class="bottom-bar">
        <MDCIconButton @click="$emit('download', arguments)">
          save_alt
        </MDCIconButton>
        <MDCIconButton @click="$emit('copy', arguments)">
          file_copy
        </MDCIconButton>
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import Card from "@/components/Card.vue";
import MDCIconButton from "@/components/MDC/MDCIconButton.vue";
import { animateAddTextTnElement } from "@/UIHelpers";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: { Card, MDCIconButton },
})
export default class LinkCard extends Vue {
  @Prop(String) readonly title: string | undefined;
  @Prop(String) readonly subtitle: string | undefined;
  @Prop(String) readonly baseUrl!: string;
  @Prop(String) readonly keyString!: string;

  urlToShow = "";

  mounted() {
    animateAddTextTnElement(
      this.baseUrl,
      this.keyString,
      3000,
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

  a {
    overflow-wrap: break-word;
    word-break: break-all;
    color: #1976d2;

    &:visited {
      color: #512da8;
    }
  }
}

.bottom-bar-container {
  width: 100%;

  .bottom-bar {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
