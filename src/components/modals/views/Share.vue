<template>
    <div class="modal-content fm-modal-share">
        <div class="modal-header">
            <h5 class="modal-title">{{ lang.modal.share ? lang.modal.share.title : 'Share' }}</h5>
            <button type="button" class="close" aria-label="Close" v-on:click="hideModal">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">          
          <template v-if="true || selectedItem.type === 'file'">
            <template v-if="protected_url">
              <div class="row">
                  <div class="col-2">{{ lang.modal.properties.url }}:</div>
                  <div class="col-9">
                      <span>{{ protected_url }}</span>
                  </div>
                  <div class="col-1 text-right">
                      <i v-on:click="copyToClipboard(protected_url)"
                         v-bind:title="lang.clipboard.copy"
                         class="far fa-copy"></i>
                  </div>
              </div>
              <div class="row" v-if="password">
                  <div class="col-2">Password:</div>
                  <div class="col-9">
                      <span>{{ password }}</span>
                  </div>
                  <div class="col-1 text-right">
                      <i v-on:click="copyToClipboard(password)"
                         v-bind:title="lang.clipboard.copy"
                         class="far fa-copy"></i>
                  </div>
              </div>
            </template>
            <template v-else>
              <div class="form-group" v-if="errors.items">
                <div class="invalid-feedback d-block" >
                    {{errors.items[0] || errors.items}}
                </div>
              </div>
              <div class="form-group">
                  <label for="fm-input-password">{{ lang.modal.share ? lang.modal.share.filedPassword : 'Password' }} <small>(Optional)</small>
                    &nbsp;<button class="btn btn-sm btn-primary" @click.prevent="genrate()"><span class="fas fa-sync-alt"></span> Genrate</button>
                  </label>
                  <input type="text" class="form-control" id="fm-input-password"
                         v-focus
                         v-bind:class="{'is-invalid': errors.password}"
                         v-on:input="removeError('password')"
                         v-model="password">
                  <div class="invalid-feedback" v-if="errors.password">
                      {{errors.password[0] || errors.password}}
                  </div>
              </div>
              <hr>
              <div class="form-group">
                <label for="fm-input-expiry">{{ lang.modal.share ? lang.modal.share.filedExpiry : 'URL expiry date' }} <small>(Optional)</small></label>
                <input type="date" class="form-control" id="fm-input-expiry"                             
                    v-on:input="removeError('expire_at')"
                    v-bind:class="{'is-invalid': errors.expire_at}"
                    v-model="expiry">
                <div class="invalid-feedback" v-if="errors.expire_at">
                      {{errors.expire_at[0] || errors.expire_at}}
                  </div>
              </div>
              
            </template>
          </template>
        </div>
        <div class="modal-footer">
            <button class="btn btn-info"
                    v-bind:disabled="submitDisable || has_errors || protected_url"
                    v-on:click="getProtectedUrl">{{ lang.btn.submit }}
            </button>
            <button class="btn btn-light" v-on:click="hideModal">{{ lang.btn.cancel }}</button>
        </div>
    </div>
</template>

<script>
import modal from './../mixins/modal';
import translate from './../../../mixins/translate';
import helper from './../../../mixins/helper';
import EventBus from './../../../eventBus';

export default {
  name: 'Share',
  mixins: [modal, translate, helper],
  data() {
    return {
      protected_url: null,
      password: null,
      password_confirmation: null,
      expiry: null,
      errors: {},
      submitDisable: false,
      has_errors: false,
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

    /**
     * Selected items
     * @returns {*}
     */
    selectedItems() {
      return this.$store.getters['fm/selectedItems'];
    },

    /**
     * Multi selection
     * @returns {boolean}
     */
    multiSelect() {
      return this.$store.getters['fm/selectedItems'].length > 1;
    },
  },

  methods: {

    removeError(field){
      delete this.errors[field];
      this.has_errors = Object.keys(this.errors).length;
    },

    genrate(){
      let password = '';

      let CharacterSet = '';
      CharacterSet += 'abcdefghijklmnopqrstuvwxyz';
      CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      CharacterSet += '0123456789';
      CharacterSet += '![]{}()%&*$#^<>~@|';

      for(let i=0; i < 15; i++) {
        password += CharacterSet.charAt(Math.floor(Math.random() * CharacterSet.length));
      }
      this.password = password;
    },

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

    /**
     * Copy text to clipboard
     * @param text
     */
    copyToClipboard(text) {
      // create input
      const copyInputHelper = document.createElement('input');
      copyInputHelper.className = 'copyInputHelper';
      document.body.appendChild(copyInputHelper);
      // add text
      copyInputHelper.value = text;
      copyInputHelper.select();
      // copy text to clipboard
      document.execCommand('copy');
      // clear
      document.body.removeChild(copyInputHelper);

      // Notification
      EventBus.$emit('addNotification', {
        status: 'success',
        message: this.lang.notifications.copyToClipboard,
      });
    },
  },
};
</script>

<style lang="scss">
    .fm-modal-share .modal-body{
        .row {
            margin-bottom: 0.3rem;
            padding-top: 0.3rem;
            padding-bottom: 0.3rem;

            .fa-copy {
                padding-top: 0.2rem;
                display: none;
                cursor: pointer;
            }

            &:hover {
                background-color: #f8f9fa;

                & .fa-copy {
                    display: block;
                }
            }
        }

        .col-2 {
            font-weight: bold;
        }

        .col-9 {
            word-wrap: break-word;
        }
    }
</style>
