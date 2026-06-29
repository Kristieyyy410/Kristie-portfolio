# Domain setup for kristiezheng.site

Current site files are ready for a GitHub Pages custom domain:

- `CNAME` contains `kristiezheng.site`
- The site should be deployed from the GitHub repository root or Pages publishing source root.

## GitHub Pages

1. Open the repository `Kristieyyy410/Kristie-portfolio`.
2. Go to `Settings` -> `Pages`.
3. Set the custom domain to `kristiezheng.site`.
4. Save and wait for DNS verification.
5. Enable `Enforce HTTPS` after GitHub marks the domain as ready.

## Namecheap DNS

In Namecheap, open `Domain List` -> `kristiezheng.site` -> `Advanced DNS`.

For the apex domain, add these `A Record` entries:

```text
Host: @    Value: 185.199.108.153
Host: @    Value: 185.199.109.153
Host: @    Value: 185.199.110.153
Host: @    Value: 185.199.111.153
```

For the `www` subdomain, add:

```text
Type: CNAME Record
Host: www
Value: Kristieyyy410.github.io
```

DNS may take a few minutes to 24 hours to propagate.
