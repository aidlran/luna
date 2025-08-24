<!-- https://codepen.io/stevenlei/pen/QWbrNeK -->

<svg width="28" height="28">
  <circle
    fill="none"
    stroke="#68E534"
    stroke-width="2"
    cx="14"
    cy="14"
    r="12"
    class="circle"
    stroke-linecap="round"
    transform="rotate(-90 14 14) "
  />
  <polyline
    fill="none"
    stroke="#68E534"
    stroke-width="2"
    points="8,17 12,21 21,11"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="tick"
  />
</svg>

<style>
  .circle {
    stroke-dasharray: 1194;
    stroke-dashoffset: 1194;
  }

  svg .circle {
    animation: circle 1.2s ease;
    animation-fill-mode: forwards;
  }

  .tick {
    stroke-dasharray: 350;
    stroke-dashoffset: 350;
  }

  svg .tick {
    animation: tick 1.8s ease;
    animation-fill-mode: forwards;
    animation-delay: 1.6s;
  }

  @keyframes circle {
    from {
      stroke-dashoffset: 1194;
    }
    to {
      stroke-dashoffset: 2388;
    }
  }

  @keyframes tick {
    from {
      stroke-dashoffset: 350;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes title {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
