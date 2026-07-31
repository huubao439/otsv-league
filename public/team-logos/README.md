# Team logos

Drop a team's crest in here as a PNG named after its **team number**:

| File    | Team        |
| ------- | ----------- |
| `1.png` | Integration |
| `2.png` | D.A.F       |
| `3.png` | MATADORES   |
| `4.png` | CHORUS FC   |
| `5.png` | ECOM        |
| `6.png` | Bơi Here    |

The number is the team's `id` in [`src/data/teams.json`](../../src/data/teams.json) — add a row
there first if you add a team.

- **Format:** PNG only. Transparent backgrounds look best; the crest is rendered inside a circle.
- **Size:** square, ideally 256×256 or larger. Anything non-square is letterboxed, so trim the
  padding before saving.
- **Replacing a logo:** overwrite the file. The app appends the file's modified time to the URL,
  so browsers pick up the new image instead of serving a cached copy.
- **Removing a logo:** delete the file. That team falls back to the generated placeholder crest
  (club colour + initials).

Any team without a file here keeps its placeholder, so you can add logos one at a time.

The **Logo** button in the admin Teams Info tab will scale an image to 256×256 and download it
already named correctly — save that file into this folder and commit it.

> The folder is read when the server renders. In `npm run dev` a new file shows up on the next
> page load; for a production build, add the files before running `npm run build`.
