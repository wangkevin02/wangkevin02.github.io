---
layout: page
permalink: /cv/
title: CV
nav: true
nav_order: 3
cv_pdf_embed: true
---

{% assign english_cv = '/assets/pdf/Kuang_Wang_CV_en.pdf' | relative_url %}
{% assign chinese_cv = '/assets/pdf/Kuang_Wang_CV_zh.pdf' | relative_url %}

<div class="cv-pdf-viewer" data-cv-pdf-viewer>
  <div class="cv-pdf-toolbar">
    <div class="cv-pdf-language" role="group" aria-label="CV language">
      <button
        class="button button-primary"
        type="button"
        data-cv-language="en"
        data-cv-label="English CV"
        data-cv-src="{{ english_cv }}"
        aria-pressed="true"
      >
        English
      </button>
      <button
        class="button"
        type="button"
        data-cv-language="zh"
        data-cv-label="中文简历"
        data-cv-src="{{ chinese_cv }}"
        aria-pressed="false"
      >
        中文
      </button>
    </div>

    <a
      class="section-link cv-pdf-open"
      href="{{ english_cv }}"
      target="_blank"
      rel="noopener noreferrer"
      data-cv-open
    >
      <i class="fa-solid fa-file-pdf" aria-hidden="true"></i> Open PDF <span aria-hidden="true">↗</span>
    </a>

  </div>

  <p class="cv-pdf-status" data-cv-status aria-live="polite">English CV</p>

<object
class="cv-pdf-object"
data="{{ english_cv }}#view=FitH"
type="application/pdf"
aria-label="Embedded English CV PDF"
data-cv-object

>

    <div class="cv-pdf-fallback">
      <p>This browser cannot display the embedded PDF.</p>
      <a href="{{ english_cv }}" target="_blank" rel="noopener noreferrer" data-cv-fallback>Open the PDF instead</a>
    </div>

  </object>

  <noscript>
    <p class="cv-pdf-noscript">
      JavaScript is required for in-page language switching.
      <a href="{{ english_cv }}">Open the English PDF</a> or
      <a href="{{ chinese_cv }}">打开中文 PDF</a>.
    </p>
  </noscript>
</div>
