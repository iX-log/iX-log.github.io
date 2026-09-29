<script lang="ts">
  type Name = 'briefcase' | 'pen' | 'mic' | 'pulse' | 'person' | 'mail' | 'grid' | 'back' | 'phone' | 'car' | 'github' | 'linkedin' | 'sun' | 'moon' | 'medium' | 'cv';
  let { name, width = 24, height = width, stroke = 1.6 }: { name: Name; width?: number; height?: number; stroke?: number } = $props();

  const paths: Record<Name, string> = {
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16v4z"></path><path d="M13.5 6.5l4 4"></path>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0"></path><path d="M12 18v3"></path>',
    pulse: '<path d="M3 17h5l2-9 3 12 2-6h6"></path>',
    person: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"></path>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"></rect><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"></rect><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"></rect><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"></rect>',
    back: '<path d="M15 5l-7 7 7 7"></path>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"></rect><path d="M11 18.5h2"></path>',
    car: '<path d="M3 15.5l2.2-5.6A3 3 0 0 1 8 8h12a3 3 0 0 1 2.8 1.9l2.2 5.6"></path><rect x="2" y="15" width="24" height="4.5" rx="1.5"></rect><circle cx="7.5" cy="19.5" r="1.6"></circle><circle cx="20.5" cy="19.5" r="1.6"></circle>',
    github: '<path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.8-2.2c2.8-.3 5.8-1.4 5.8-6.3a4.9 4.9 0 0 0-1.3-3.4 4.6 4.6 0 0 0-.1-3.4s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2 5.4 2.3 5.4 2.3a4.6 4.6 0 0 0-.1 3.4A4.9 4.9 0 0 0 4 9.1c0 4.9 3 6 5.8 6.3a3 3 0 0 0-.8 2.2V21"></path>',
    medium: '<path d="M4 6.5h4.2L12 14l3.8-7.5H20"></path><path d="M4 6.5v11M20 6.5v11M12 14v3.5"></path>',
    cv: '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M9 8h6M9 12h6M9 16h3"></path>',
    sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"></path>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"></path>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="M8 10.5V16M8 7.5v.01M12 16v-3.2a2.3 2.3 0 0 1 4.5 0V16M12 10.5V16"></path>',
  };
  const viewBox = $derived(name === 'car' ? '0 0 28 24' : '0 0 24 24');
</script>

<svg {width} {height} {viewBox} fill="none" stroke="currentColor" stroke-width={stroke} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {@html paths[name]}
</svg>
