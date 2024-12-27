# Convention of File organization

This convention pertains to the root directory of personal computers across various operating systems. It's important to note that the root directory varies depending on the operating system being used. In Linux, the root directory is typically represented as `/home/<username>`; in macOS, it is `/Users/<username>`; while in Windows, it is commonly denoted as `D:\`.

## Folder Structure

- **documents**: All files within this folder should be automatically synchronized with cloud servers.
  - **family**: Contains comprehensive information pertaining to family members' identity, income, insurance, taxes, and related documentation.
  - **organization**: Stores resources and materials associated with various organizations.
  - **studio**: Reserved for private projects and initiatives.
  - **subject**: Dedicated to study resources, aiding in educational endeavors and research materials.
- **git**: Manual synchronization is required for all files within this folder, intended for various Git repositories. Subfolders within this folder include:
  - **private**: Dedicated to private programming projects. These projects are configured as private repositories on the remote server.
  - **public**: Reserved for public programming projects. These projects are designated as public repositories on the remote server.
  - **docs**: Houses both private and public documents, emphasizing flexibility in document classification.

## File Name Convention

The naming convention for folders or files follows this structure:

```xml
[<date>#]<name>[@<organization>]
```

Here are the specific guidelines:

- `<date>`: The date format should be `YYYY-MM-DD`.
- `<name>`: Use snake_case for the name.
- `<organization>`: Employ snake case for the organization name.
