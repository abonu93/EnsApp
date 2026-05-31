<script lang="ts">
  // iOS-style toggle switch.
  interface Props {
    checked: boolean;
    onChange?: (v: boolean) => void;
    label?: string;
  }
  let { checked = $bindable(false), onChange, label = "" }: Props = $props();

  function toggle() {
    checked = !checked;
    onChange?.(checked);
  }
</script>

<button
  type="button"
  class="switch"
  class:on={checked}
  role="switch"
  aria-checked={checked}
  aria-label={label}
  onclick={toggle}
>
  <span class="knob"></span>
</button>

<style>
  .switch {
    width: 46px;
    height: 28px;
    border-radius: 999px;
    background: var(--border);
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
    transition: background var(--transition-base);
  }
  .switch.on { background: var(--primary); }
  .switch:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transition: left var(--transition-base);
  }
  .switch.on .knob { left: 21px; }
</style>
