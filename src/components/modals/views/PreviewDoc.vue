<template>
    <div class="modal-content fm-modal-preview">
        <div class="modal-header">
            <h5 class="modal-title w-75  text-truncate">
              {{ lang.modal.preview.title }}
              <small class="text-muted pl-3">{{ selectedItem.basename }}</small>
            </h5>
            <button type="button" class="close" aria-label="Close" v-on:click="hideModal">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body"> 
          <iframe :src="previewUrl" class="w-100" style="min-height: 70vh"></iframe>         
          <a :href="fileUrl" target="_blank"><div class="jd0ver"></div></a>
        </div>
    </div>
</template>

<script>
import modal from './../mixins/modal';
import translate from './../../../mixins/translate';
import helper from './../../../mixins/helper';
import EventBus from './../../../eventBus';

export default {
  name: 'PreviewDoc',

  mixins: [modal, translate, helper],

  data() {
    return {
      basePreviewUrl: 'https://docs.google.com/gview?url=:url&embedded=true',
    };
  },

  computed: {
    /**
     * Selected disk
     * @returns {*}
     */
    selectedDisk() {
      return this.$store.getters['fm/selectedDisk'];
    },

    /**
     * Selected item
     * @returns {*}
     */
    selectedItem() {
      return this.$store.getters['fm/selectedItems'][0];
    },

    loggedInToken(){
      return this.$store.state.fm.auth.token;
    },

    fileUrl(){
      return `${this.$store.getters['fm/settings/baseUrl']}preview_docs?token=${this.loggedInToken}&disk=${this.selectedDisk}&path=${this.selectedItem.path}&v=${this.selectedItem.timestamp}`;
    },

    previewUrl(){
      return this.basePreviewUrl.replace(':url', window.encodeURIComponent(this.fileUrl));
    },
  },

  methods: {
    /**
     * Get Protected URL
     */
    getProtectedUrl() {
      this.errors = {};
      this.submitDisable = true;
      this.$store.dispatch('fm/protectedUrl', {
        disk: this.selectedDisk,
        items: this.selectedItems,
        options: {
          password: this.password,
          password_confirmation: this.password,
          expiry: this.expiry,
        },
      }).then((response) => {
        if (response.data.result.status === 'success') {
          this.protected_url = response.data.url;
        }
      }).catch((error)=>{
        let response = error.response;
        if(response.status == 422){
          this.errors = response.data.errors;
        }
      }).finally(()=>{
        this.submitDisable = false;
        this.has_errors = Object.keys(this.errors).length;
      });
    },
  },
};
</script>

<style>
  .jd0ver{
    width: 100px;
    height: 100px;
    /*background: rebeccapurple;*/
    position: absolute;
    top: 77px;
    right: 14px;
    top: 0;
    right: 0;
  }
</style>
