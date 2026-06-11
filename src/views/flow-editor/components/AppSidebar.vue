<template>
  <aside class="fe-sidebar">
    <div class="fe-sidebar__logo">F</div>
    <nav class="fe-sidebar__nav">
      <button class="fe-sidebar__item fe-sidebar__item--active" type="button" title="Flows">⌁</button>
      <button class="fe-sidebar__item" type="button" title="Home">⌂</button>
      <button class="fe-sidebar__item" type="button" title="Settings">⚙</button>
    </nav>
  </aside>
</template>

<style scoped>
.fe-sidebar {
  width: var(--fe-sidebar-width);
  background: var(--fe-sidebar-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  flex-shrink: 0;
}

.fe-sidebar__logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--fe-primary);
  color: #0f172a;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.fe-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fe-sidebar__item {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
  font-size: 16px;
}

.fe-sidebar__item--active,
.fe-sidebar__item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
</style>
