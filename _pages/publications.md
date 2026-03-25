---
layout: page
permalink: /publications/
title: Publications
nav: true
nav_order: 2
---

## Selected Publications

{% bibliography --query @*[selected=true] %}

---

## All Publications

{% bibliography --query @*[selected!=true] %}