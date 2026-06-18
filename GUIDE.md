# راهنمای ساختار پروژه SmartDine

---

## app/

### `app/layout.tsx`
ریشه‌ی همه صفحات. فونت Vazirmatn را از Google بارگذاری می‌کند،
`lang="fa" dir="rtl"` را روی `<html>` می‌گذارد، و متادیتا (title/description) را از `locales/fa.json` می‌خواند.
چون سرور کامپوننت است نمی‌تواند از hook استفاده کند.

### `app/globals.css`
استایل‌های پایه‌ی کل اپلیکیشن:
- ایمپورت Tailwind CSS v4
- تعریف dark mode با کلاس `.dark`
- فونت پیش‌فرض body (متغیر `--applied-font` که از JS تغییر می‌کند)
- استایل scrollbar سراسری

### `app/page.tsx`
صفحه اصلی داشبورد. دو بخش دارد:
- `DashboardPage` (outer): state تنظیمات را نگه می‌دارد، `LocaleProvider` را با زبان انتخابی wrap می‌کند.
- `DashboardInner` (inner): از `useLocale()` استفاده می‌کند. تنظیمات را روی DOM اعمال می‌کند (dark/RTL/fontSize/font)، fullscreen و FontPicker را مدیریت می‌کند، و `DashboardLayout` را رندر می‌کند.

### `app/not-found.tsx`
صفحه‌ی 404. چون سرور کامپوننت است مستقیم از `locales/fa.json` ایمپورت می‌کند (نه hook).
از `GoBackButton` برای دکمه بازگشت استفاده می‌کند.

### `app/language/page.tsx`
صفحه تنظیمات زبان (باز می‌شود وقتی از Settings Panel روی «زبان» کلیک می‌شود):
- **بخش اول:** انتخاب زبان نمایش (fa/en/fr) + دکمه «اعمال» که به localStorage ذخیره می‌کند.
- **بخش دوم:** ویرایش ترجمه‌ها — انتخاب زبان ویرایش + انتخاب بخش (nav/topbar/...) + فیلدهای key-value که مقادیر را به `smartdine-locale-custom-{lang}` در localStorage ذخیره می‌کنند.

---

## components/

### `components/GoBackButton.tsx`
دکمه «بازگشت» که فقط در صفحه 404 استفاده می‌شود.
از `useLocale()` متن می‌گیرد — چون خارج از `LocaleProvider` است از مقدار پیش‌فرض context (فارسی) استفاده می‌کند.

---

## components/layout/

کل سیستم layout داشبورد. هر فایل داخل این پوشه بخشی از چارچوب اصلی UI است.

### `components/layout/DashboardLayout.tsx`
پوسته اصلی داشبورد. `Sidebar`، `Topbar`، `BottomNav` و ناحیه محتوا (`children`) را کنار هم می‌چیند.
مدیریت باز/بسته شدن sidebar موبایل هم اینجاست.

### `components/layout/Topbar.tsx`
نوار بالای صفحه. شامل:
- hamburger (toggle sidebar)
- searchbar
- دکمه dark mode (desktop)
- bell اعلان‌ها + dropdown لیست اعلان‌ها
- دکمه تنظیمات + dropdown Settings Panel
- color swatch رنگ topbar
- آواتار پروفایل + dropdown پروفایل

### `components/layout/Sidebar.tsx`
منوی کناری. شامل:
- لوگو + نام اپ
- منوی ناوبری چند سطحی (۳ سطح: item → sub → grand)
- رنگ‌ساز پس‌زمینه و متن در پایین
- قابلیت resize با drag از لبه
- نسخه موبایل به صورت overlay

### `components/layout/BottomNav.tsx`
نوار ناوبری پایین صفحه (فقط موبایل). آیتم‌ها را از `bottomNavItems` می‌گیرد.
با `visible` prop نمایش/مخفی می‌شود.

### `components/layout/FontPicker.tsx`
مودال انتخاب فونت (باز می‌شود از Settings Panel):
- آپلود فونت سفارشی (TTF/WOFF/WOFF2/OTF تا ۳ مگ)
- انتخاب از فونت‌های preset
- تایپ نام فونت Google Fonts
- preview زنده
فونت آپلودشده در `localStorage` (`smartdine-font-data`) ذخیره می‌شود.

### `components/layout/Ico.tsx`
کامپوننت SVG آیکون. یک `<path>` می‌گیرد و آن را داخل `<svg>` رندر می‌کند.
strokeWidth پیش‌فرض ۱.۸ است.

### `components/layout/layout.css`
استایل‌های اختصاصی layout:
- `.resizing` — cursor را در حین drag sidebar تغییر می‌دهد
- `.sidebar-scroll` — scrollbar منوی کناری با رنگ دینامیک (`--sb-thumb`)
- `.settings-scroll` — scrollbar dropdown‌های topbar

---

## components/layout/data/

فایل‌های داده ثابت (constants). هیچ منطق رابط کاربری ندارند.

### `components/layout/data/topbar-data.ts`
شامل `ICONS`: آبجکتی که نام آیکون را به SVG path نگاشت می‌کند.
مثال: `ICONS.hamburger`, `ICONS.bell`, `ICONS.globe`.

### `components/layout/data/sidebar-data.ts`
دو چیز دارد:
- `PATHS`: SVG path هر آیکون منو (dashboard، calendar، ...)
- `getNavItems(t)`: تابعی که locale را می‌گیرد و آرایه آیتم‌های منو را برمی‌گرداند (label ها از ترجمه می‌آیند).

### `components/layout/data/font-data.ts`
لیست `PRESET_FONT_FAMILIES`: فونت‌های پیش‌فرض که در `FontPicker` نمایش داده می‌شوند.

---

## components/layout/ui/

کامپوننت‌های کوچک و بدون منطق که فقط UI هستند.

### `components/layout/ui/Pill.tsx`
دکمه toggle سبک iOS. prop `on: boolean` می‌گیرد، رنگش عوض می‌شود.
در Settings Panel برای dark mode، fullscreen، و bottom nav استفاده می‌شود.

### `components/layout/ui/ColorSwatch.tsx`
دو نوع color picker دارد:
- `TopbarColorSwatch` — دایره کوچک گرد برای انتخاب رنگ topbar
- `SidebarColorSwatch` — ردیف label + مربع رنگ برای sidebar

### `components/layout/ui/SettingsRow.tsx`
یک ردیف قابل کلیک در Settings Panel.
سه بخش دارد: آیکون + label (سمت چپ) + عنصر راست (مثل Pill یا badge).

### `components/layout/ui/DropdownPanel.tsx`
پوسته dropdown‌های topbar (اعلان‌ها، تنظیمات، پروفایل).
backdrop تاریک پشت panel می‌گذارد که با کلیک بسته می‌شود. position از `getDropdownStyle` می‌آید.

---

## components/layout/utils/

توابع کمکی خالص (بدون state/JSX).

### `components/layout/utils/dropdown-utils.ts`
تابع `getDropdownStyle(btn, direction)`:
موقعیت dropdown را نسبت به دکمه‌ای که کلیک شده محاسبه می‌کند.
در RTL dropdown از چپ، در LTR از راست anchor می‌شود و از لبه viewport بیرون نمی‌زند.

### `components/layout/utils/font-utils.ts`
سه ابزار مربوط به فونت:
- `UPLOADED_FONT_KEY` — کلید localStorage برای ذخیره فونت آپلودشده
- `loadGoogleFont(family)` — یک `<link>` به Google Fonts اضافه می‌کند (اگر قبلاً اضافه نشده)
- `injectUploadedFont(name, base64)` — فونت را از base64 به `document.fonts` اضافه می‌کند

---

## contexts/

### `contexts/LocaleContext.tsx`
React Context برای زبان. دو چیز export می‌کند:
- `LocaleProvider` — دور کامپوننت‌ها wrap می‌شود، زبان (`lang`) می‌گیرد، locale را از localStorage merge می‌کند و به context می‌دهد.
- `useLocale()` — در هر کامپوننت داخل provider قابل استفاده است، آبجکت ترجمه را برمی‌گرداند.

مقدار پیش‌فرض context فارسی است، پس کامپوننت‌هایی مثل `GoBackButton` که خارج از Provider هستند کرش نمی‌دهند.

---

## lib/

### `lib/locale.ts`
منطق اصلی سیستم i18n:
- `LocaleData` — نوع TypeScript برای آبجکت ترجمه (از fa.json استنتاج می‌شود)
- `LOCALES` — نگاشت `LangCode → LocaleData` برای سه زبان
- `LANG_NAMES` / `LANG_FLAGS` — نام و پرچم هر زبان
- `LOCALE_CUSTOM_KEY` — پیشوند کلید localStorage برای ترجمه‌های سفارشی
- `deepMerge` — دو آبجکت تودرتو را ادغام می‌کند (برای اعمال override‌های سفارشی)
- `loadLocale(lang)` — locale پایه را می‌گیرد، override‌های localStorage را روی آن merge می‌کند

---

## types/

تعریف تایپ‌های TypeScript. هیچ کد اجرایی ندارند.

### `types/settings.ts`
- `LangCode` — `'fa' | 'en' | 'fr'`
- `AppSettings` — همه تنظیمات کاربر (dark، direction، fontSize، sidebar، font، language)
- `DEFAULTS` — مقادیر پیش‌فرض تنظیمات
- `SETTINGS_KEY` — کلید localStorage
- `loadSettings()` — تنظیمات را از localStorage می‌خواند

---

## types/layout/

تایپ‌های مربوط به کامپوننت‌های layout.

### `types/layout/sidebar.ts`
- `SidebarProps` — props کامپوننت `Sidebar`
- `SidebarBodyProps` — props بخش داخلی sidebar (SidebarBody)

### `types/layout/topbar.ts`
- `TopbarNotification` — ساختار هر اعلان (id/title/subtitle/time)
- `TopbarProps` — props کامپوننت `Topbar`

### `types/layout/bottomnav.ts`
- `BottomNavItem` — ساختار هر آیتم نوار پایین (label/icon/active/onClick)

### `types/layout/navigation.ts`
- `SidebarIconKey` — نام‌های مجاز آیکون‌های منو
- `GrandItem` / `SubItem` / `NavItemDef` — ساختار آیتم‌های منوی ۳ سطحی

### `types/layout/ui.ts`
props کامپوننت‌های کوچک UI:
- `PillProps`, `SettingsRowProps`, `DropdownPanelProps`
- `TopbarColorSwatchProps`, `SidebarColorSwatchProps`

### `types/layout/ico.ts`
- `IcoProps` — props کامپوننت `Ico` (d, d2, className, strokeWidth)

### `types/layout/fontpicker.ts`
- `UploadedFont` — ساختار فونت آپلودشده (name/base64)
- `FontPickerProps` — props کامپوننت `FontPicker`

---

## locales/

فایل‌های JSON ترجمه. هر فایل همان ساختار را دارد.

### `locales/fa.json` — فارسی (پیش‌فرض)
### `locales/en.json` — انگلیسی
### `locales/fr.json` — فرانسوی

**بخش‌های موجود در هر فایل:**

| کلید | محتوا |
|---|---|
| `app` | نام اپ، متادیتا |
| `nav` | لیبل‌های منوی ناوبری |
| `sidebar` | متن‌های منوی کناری |
| `topbar` | متن‌های نوار بالا |
| `notifications` | متن‌های پنل اعلان |
| `settingsPanel` | متن‌های پنل تنظیمات |
| `bottomNav` | لیبل‌های نوار پایین موبایل |
| `dashboard` | متن‌های صفحه اصلی |
| `notFound` | متن‌های صفحه ۴۰۴ |
| `fontPicker` | متن‌های مودال فونت |
| `languagePage` | متن‌های صفحه تنظیمات زبان |

---

## اضافه کردن صفحه جدید

همه صفحاتی که داشبورد (sidebar/topbar) می‌خواهند باید داخل `app/(dashboard)/` باشند.

**قدم ۱ — پوشه و فایل بساز:**
```
app/(dashboard)/orders/page.tsx
```

**قدم ۲ — محتوای فایل:**
```tsx
'use client';

export default function OrdersPage() {
  return (
    <div className="p-6">
      <h1>سفارشات</h1>
    </div>
  );
}
```

همین. sidebar، topbar، dark mode، فونت — همه خودکار از `app/(dashboard)/layout.tsx` اعمال می‌شوند.

صفحاتی که داشبورد **نمی‌خواهند** (مثل `/language`) را مستقیم داخل `app/` بگذار.

---

## اضافه کردن زبان جدید

**مثال: اضافه کردن آلمانی (de)**

### قدم ۱ — فایل JSON ترجمه بساز

یک کپی از `locales/fr.json` بگیر، ترجمه کن و ذخیره کن:
```
locales/de.json
```

### قدم ۲ — `LangCode` را گسترش بده

فایل `types/settings.ts`:
```ts
export type LangCode = 'fa' | 'en' | 'fr' | 'de';
```

### قدم ۳ — به `lib/locale.ts` اضافه کن

چهار جا:
```ts
import deData from '@/locales/de.json';

export const LOCALES: Record<LangCode, LocaleData> = {
  fa: faData,
  en: enData as LocaleData,
  fr: frData as LocaleData,
  de: deData as LocaleData,   // ← اضافه
};

export const LANG_NAMES: Record<LangCode, string> = {
  ...
  de: 'Deutsch',   // ← اضافه
};

export const LANG_FLAGS: Record<LangCode, string> = {
  ...
  de: '🇩🇪',   // ← اضافه
};

export const LANG_DIR: Record<LangCode, 'rtl' | 'ltr'> = {
  ...
  de: 'ltr',   // ← اضافه (زبان‌های RTL: فقط 'fa' و 'ar')
};
```

### قدم ۴ — تمام

صفحه `/language` خودکار زبان جدید را نشان می‌دهد.
تغییر زبان از صفحه `/language` هم `language` هم `direction` را با هم ذخیره می‌کند.

---

## جریان داده (Data Flow)

```
localStorage (smartdine-settings)
        ↓
  app/page.tsx (DashboardPage)
        ↓ settings.language
  LocaleProvider (contexts/LocaleContext.tsx)
        ↓ loadLocale() → base JSON + custom overrides
  useLocale() در هر کامپوننت داخلی
```

**ذخیره‌سازی در localStorage:**

| کلید | محتوا |
|---|---|
| `smartdine-settings` | تنظیمات کاربر (dark/font/direction/...) |
| `smartdine-font-data` | فونت آپلودشده به صورت base64 |
| `smartdine-locale-custom-fa` | override‌های ترجمه فارسی |
| `smartdine-locale-custom-en` | override‌های ترجمه انگلیسی |
| `smartdine-locale-custom-fr` | override‌های ترجمه فرانسوی |
