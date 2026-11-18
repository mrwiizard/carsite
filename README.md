# Best Buy Automobile — Website

One-page website for **Best Buy Automobile** (bestbuyautomobile.com), Strandvägen 7A, Östermalm, Stockholm.

Plain HTML, CSS and JavaScript, plus one small PHP file for the contact forms. There is nothing to install or build, so it runs on any normal cPanel hosting.

---

## What's in the zip

`bestbuyautomobile-site.zip` contains:

| File | What it does |
|---|---|
| `index.html` | The whole website (all text and sections) |
| `styles.css` | Design: colours, layout, glass effects |
| `script.js` | Search filters, mobile menu, animations, form sending |
| `send.php` | Emails form submissions to the dealership |
| `images/` | All photos (cars, showroom, dealer portrait) |
| `README.md` | This guide |

---

## Upload to cPanel (about 5 minutes)

1. Log in to **cPanel** and open **File Manager**.
2. Open the **`public_html`** folder (this is your website's root folder).
   - If there's an old site in there (`index.html`, `index.php`, `default.html`), move it into a backup folder first or delete it.
3. Click **Upload**, select `bestbuyautomobile-site.zip` and wait for it to reach 100%.
4. Go back to `public_html`, right-click the zip, choose **Extract**, and extract into `/public_html`.
5. Check that `index.html` sits **directly inside `public_html`**, not in a subfolder. If it ended up in a subfolder, select everything in that subfolder, choose **Move**, and move it to `/public_html`.
6. Delete the zip from `public_html` (it's no longer needed).
7. Open **https://bestbuyautomobile.com**. The site should load.

> **HTTPS:** If the site shows "Not secure", go to cPanel → **SSL/TLS Status** and click **Run AutoSSL**.

---

## Make the forms send email (required)

The "Book a test drive" and "Sell / Trade-in" forms are emailed to you by `send.php`.

1. In cPanel → **Email Accounts**, create an address on your domain, e.g. `website@bestbuyautomobile.com`.
   (Mail must be sent *from* your own domain, or it will go to spam.)
2. In **File Manager**, right-click `send.php` and choose **Edit**.
3. Change these two lines at the top:

   ```php
   $to   = 'sales@bestbuyautomobile.com';     // inbox that RECEIVES the leads
   $from = 'website@bestbuyautomobile.com';   // the address you created in step 1
   ```

4. Click **Save Changes**.
5. Test it: fill in the form on the live site and check the inbox (and the spam folder the first time).

If you see *"Sorry, that didn't send"*, check that both addresses are correct and that the `$from` address exists in cPanel → Email Accounts.

---

## Editing content

Open `index.html` in cPanel's editor (right-click → **Edit**). Each section is labelled with a comment such as `<!-- ===== INVENTORY ===== -->`.

**Cars:** each car is an `<article class="car">` block. To change one:
- `data-type`: `suv`, `sedan`, `hatch` or `truck` (used by the filters)
- `data-price`: the price as a plain number in kronor, e.g. `339900` (used by the budget search)
- `data-year`: model year (used by the year search)
- Then update the visible title, price tag, specs and image.

To add a car, copy a whole `<article> … </article>` block and edit it.

**Photos:** upload new images into `images/` and change the `src="images/…"` path. Keep car photos around 1200 px wide and the hero photo around 2400 px wide, so pages load fast.

**Dealer / contact details:** search `index.html` for `Thomas Ackermann`, `Strandvägen` and `+49 1521` to find every place they appear. The phone number also appears once in `script.js` (in the error message).

---

## Before going live, please check

These were filled in as placeholders and should be confirmed or replaced:

- [ ] Founding year (2009) and "15 yrs" badge
- [ ] Stats: years, cars sold, inspection points, % who'd buy again
- [ ] Rating "1,200+ drivers" and the three customer reviews
- [ ] Opening hours (contact section)
- [ ] The six cars, their specs and prices
- [ ] Postcode 114 56 in the address

---

## Run locally (optional, for developers)

```bash
php -S localhost:8080
```

Then open http://localhost:8080. Forms won't send email locally; they only send on the real host.

---

## Credits

Car and showroom photos: [Freepik](https://www.freepik.com) (free licence, which requires the "Photos: Freepik" credit in the footer, so please keep it).
