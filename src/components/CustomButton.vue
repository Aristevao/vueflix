<template>
  <button :class="buttonClass" @click.prevent="handleClick" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'CustomButton',
    props: {
      type: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary'].includes(value)
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      buttonClass() {
        return {
          'button-3': this.type === 'primary',
          'button-4': this.type === 'secondary',
          'button-5': this.type === 'red'
        }
      }
    }
    // methods: {
    //   handleClick(event) {
    //     this.$emit('click', event);
    //   },
    // },
  }
</script>

<style scoped>

  /* Primary button styles */
  .button-3 {
    appearance: none;
    background-color: #2ea44f;
    border: 1px solid rgba(27, 31, 35, 0.15);
    border-radius: 6px;
    box-shadow: rgba(27, 31, 35, 0.1) 0 1px 0;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-family: -apple-system, system-ui, 'Segoe UI', Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji';
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    padding: 6px 16px;
    position: relative;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: middle;
    white-space: nowrap;
  }

  .button-3:focus:not(:focus-visible):not(.focus-visible) {
    box-shadow: none;
    outline: none;
  }

  .button-3:hover {
    background-color: #2c974b;
  }

  .button-3:focus {
    box-shadow: rgba(46, 164, 79, 0.4) 0 0 0 3px;
    outline: none;
  }

  .button-3:disabled {
    background-color: #94d3a2;
    border-color: rgba(27, 31, 35, 0.1);
    color: rgba(255, 255, 255, 0.8);
    cursor: default;
  }

  .button-3:active {
    background-color: #298e46;
    box-shadow: rgba(20, 70, 32, 0.2) 0 1px 0 inset;
  }

  /* Secondary button styles */
  .button-4 {
    appearance: none;
    background-color: #fafbfc;
    border: 1px solid rgba(27, 31, 35, 0.15);
    border-radius: 6px;
    box-shadow:
      rgba(27, 31, 35, 0.04) 0 1px 0,
      rgba(255, 255, 255, 0.25) 0 1px 0 inset;
    box-sizing: border-box;
    color: #24292e;
    cursor: pointer;
    display: inline-block;
    font-family: -apple-system, system-ui, 'Segoe UI', Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji';
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    list-style: none;
    padding: 6px 16px;
    position: relative;
    transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: middle;
    white-space: nowrap;
    word-wrap: break-word;
  }

  .button-4:hover {
    background-color: #f3f4f6;
    text-decoration: none;
    transition-duration: 0.1s;
  }

  .button-4:disabled {
    background-color: #fafbfc;
    border-color: rgba(27, 31, 35, 0.15);
    color: #959da5;
    cursor: default;
  }

  .button-4:active {
    background-color: #edeff2;
    box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
    transition: none 0s;
  }

  .button-4:focus {
    outline: 1px transparent;
  }

  .button-4:before {
    display: none;
  }

  .button-4:-webkit-details-marker {
    display: none;
  }

  /* Red button styles */
  .button-5 {
    appearance: none;
    background-color: #d73a49;
    border: 1px solid rgba(27, 31, 35, 0.15);
    border-radius: 6px;
    box-shadow: rgba(27, 31, 35, 0.1) 0 1px 0;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-family: -apple-system, system-ui, 'Segoe UI', Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji';
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    padding: 6px 16px;
    position: relative;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: middle;
    white-space: nowrap;
  }

  .button-5:focus:not(:focus-visible):not(.focus-visible) {
    box-shadow: none;
    outline: none;
  }

  .button-5:hover {
    background-color: #cb2431;
  }

  .button-5:focus {
    box-shadow: rgba(215, 58, 73, 0.4) 0 0 0 3px;
    outline: none;
  }

  .button-5:disabled {
    background-color: #e996a5;
    border-color: rgba(27, 31, 35, 0.1);
    color: rgba(255, 255, 255, 0.8);
    cursor: default;
  }

  .button-5:active {
    background-color: #c22e3a;
    box-shadow: rgba(156, 42, 53, 0.2) 0 1px 0 inset;
  }

  /* Additional styles for controls */
  .controls {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }
</style>
