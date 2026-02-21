import path from 'node:path'
import { readdir } from 'node:fs/promises'

// Some constants.
const OUTPUT_FILE_PATH = '../build/README.md'
const INTRODUCTION_FILE_PATH = './content/introduction.json'
const PROJECTS_FILE_PATH = './content/projects.json'
const ONGOING_DIR = './content/ongoing'
const OUTSIDE_OF_CODING_DIR = './content/outside-of-coding'
const FIND_ME_FILE_PATH = './content/find-me.json'

/**
 * Projects section.
 *
 * @property description
 * @property entries
 */
interface ProjectsSection {
  description: string
  entries: {
    name: string
    description: string
    status: 'developing' | 'maintaining' | 'completed' | 'archived'
    startDate: string
    endDate?: string | null
  }[]
}

/**
 * Ongoing section.
 *
 * @property description
 * @property recentlyCompleted
 * @property currentlyLearning
 * @property currentlyWorkingOn
 */
interface OngoingSection {
  description: string
  recentlyCompleted: string[]
  currentlyLearning: string[]
  currentlyWorkingOn: string[]
}

/**
 * Outside of coding section.
 *
 * @property description
 * @property entries
 */
interface OutsideOfCodingSection {
  description: string
  entries: {
    event: string
    achievement: string
    date: string
    comment: string
  }[]
}

/**
 * Find me section.
 *
 * @property description
 * @property entries
 */
interface FindMeSection {
  description: string
  entries: {
    name: string
    urlTitle: string
    url: string
  }[]
}

/**
 * Retrieves the path to the file with the largest number in a given directory.
 *
 * This function assumes that the files in the given directory are named with a
 * number representing a date in the format YYYYMMDD, and that the file with the
 * largest number corresponds to the latest date.
 *
 * @param directory - The directory to search for.
 * @returns The filename and the path of the file with the largest number in
 *   the given directory; null if the directory is empty or does not exist.
 */
async function findLatestFilePath(
  directory: string
): Promise<[string, string] | null> {
  const files = await readdir(directory)
  const filenameMap: Record<string, string> = {}
  for (const file of files) {
    const filePath = path.join(directory, file)
    const fileNameWithoutExtension = file.split('.')[0]
    if (!/^\d{8}$/.test(fileNameWithoutExtension)) {
      continue
    }

    filenameMap[fileNameWithoutExtension] = filePath
  }

  if (Object.keys(filenameMap).length === 0) {
    return null
  }

  const latestFileName = Object.keys(filenameMap).sort().reverse()[0]
  return [latestFileName, filenameMap[latestFileName]]
}

/**
 * Imports a JSON file and returns its content as an object of type T.
 *
 * @param T - The expected type of the content of the JSON file.
 * @param jsonFilePath - The path to the JSON file to import.
 * @returns A promise that resolves to the content of the JSON file as an object
 *   of type T.
 */
async function importJsonFile<T>(jsonFilePath: string): Promise<T> {
  if (!jsonFilePath.endsWith('.json')) {
    throw new Error(`The file at ${jsonFilePath} is not a JSON file.`)
  }

  if (!jsonFilePath.startsWith('./')) {
    jsonFilePath = './' + jsonFilePath
  }

  const { default: jsonData } = await import(jsonFilePath)
  return jsonData as T
}

/**
 * Formats a date string in the format YYYYMM to a more human-readable format.
 *
 * @param input - The date string to format, in the format YYYYMM.
 * @returns The formatted date string, in the format "Mon YYYY".
 */
function formatMonthYear(input: string): string {
  const year = parseInt(input.slice(0, 4), 10)
  const month = parseInt(input.slice(4), 10) - 1

  const date = new Date(year, month)

  return date.toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Formats a date string in the format YYYYMMDD to a more human-readable format.
 *
 * @param input - The date string to format, in the format YYYYMMDD.
 * @returns The formatted date string, in the format "Mon DD, YYYY".
 */
function formatMonthDayYear(input: string): string {
  const year = parseInt(input.slice(0, 4), 10)
  const month = parseInt(input.slice(4, 6), 10) - 1
  const day = parseInt(input.slice(6), 10)

  const date = new Date(year, month, day)
  return date.toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Appends title and introduction to the given lines array.
 */
async function appendIntroduction(lines: string[]) {
  const items = await importJsonFile<string[]>(INTRODUCTION_FILE_PATH)

  lines.push('# 👋 Hi, I am James Chen\n')

  for (const item of items) {
    lines.push(item)
    lines.push('')
  }

  lines.push(
    '![Top Programming Languages](https://github-readme-stats-fast.vercel.' +
      'app/api/top-langs/?username=TypingHare&layout=compact)'
  )
}

/**
 * Appends the "Projects" section to the given lines array.
 */
async function appendProjectsSection(lines: string[]) {
  const { description, entries } =
    await importJsonFile<ProjectsSection>(PROJECTS_FILE_PATH)

  lines.push('## Projects\n')
  if (description) {
    lines.push(description)
    lines.push('')
  }

  const dateTitleCell = '&nbsp;'.repeat(8) + 'Date' + '&nbsp;'.repeat(8)
  lines.push(`| Name | Description | Status | ${dateTitleCell} |`)
  lines.push('| --- | --- | --- | --- |')
  for (const entry of entries) {
    const { name, description, status, startDate, endDate } = entry
    const startDateString = formatMonthYear(startDate)
    const endDateString = endDate ? formatMonthYear(endDate) : '_Present_'
    const dateRangeString =
      startDate === endDate
        ? startDateString
        : `${startDateString} - ${endDateString}`
    lines.push(
      `| ${name} | ${description} | **${status.toUpperCase()}** | ` +
        `${dateRangeString} |`
    )
  }
}

/**
 * Appends the "Ongoing" section to the given lines array.
 */
async function appendOngoingSection(lines: string[]) {
  const latestFile = await findLatestFilePath(ONGOING_DIR)
  if (!latestFile) {
    return console.error('No files found in the ongoing directory.')
  }

  const [fileName, filePath] = latestFile

  const {
    description,
    recentlyCompleted,
    currentlyLearning,
    currentlyWorkingOn,
  } = await importJsonFile<OngoingSection>(filePath)

  lines.push(`## Ongoing (${formatMonthDayYear(fileName)})\n`)
  if (description) {
    lines.push(description)
    lines.push('')
  }

  if (recentlyCompleted.length > 0) {
    lines.push('- **Recently Completed**')
    for (const item of recentlyCompleted) {
      lines.push(`  - ${item}`)
    }
  }

  if (currentlyLearning.length > 0) {
    lines.push('- **Currently Learning**')
    for (const item of currentlyLearning) {
      lines.push(`  - ${item}`)
    }
  }

  if (currentlyWorkingOn.length > 0) {
    lines.push('- **Currently Working On**')
    for (const item of currentlyWorkingOn) {
      lines.push(`  - ${item}`)
    }
  }
}

/**
 * Appends the "Outside of Coding" section to the given lines array.
 */
async function appendUOutsideOfCodingSection(lines: string[]): Promise<void> {
  const latestFile = await findLatestFilePath(OUTSIDE_OF_CODING_DIR)
  if (!latestFile) {
    return console.error('No files found in the outside-of-coding directory.')
  }

  const [fileName, filePath] = latestFile
  const { description, entries } =
    await importJsonFile<OutsideOfCodingSection>(filePath)

  lines.push(`## Outside of Coding (${formatMonthDayYear(fileName)})\n`)
  if (description) {
    lines.push(description)
    lines.push('')
  }

  lines.push('| Event | Achievement | Date | Comment |')
  lines.push('| --- | --- | --- | --- |')
  for (const entry of entries) {
    const { event, achievement, date, comment } = entry
    lines.push(`| ${event} | ${achievement} | ${date} | ${comment} |`)
  }
}

/**
 * Appends the "Find Me" section to the given lines array.
 */
async function appendFindMeSection(lines: string[]) {
  const { description, entries } =
    await importJsonFile<FindMeSection>(FIND_ME_FILE_PATH)

  lines.push('## Find Me\n')
  if (description) {
    lines.push(description)
    lines.push('')
  }

  for (const entry of entries) {
    const { name, urlTitle, url } = entry
    lines.push(`${name}: [${urlTitle}](${url})<br>`)
  }
}

/**
 * Builds the README content by appending the content of each section to the
 * given lines array.
 */
async function buildReadme(): Promise<string[]> {
  const readme: string[] = []
  console.log(`Building README content...`)
  await appendIntroduction(readme)
  await appendProjectsSection(readme)
  await appendOngoingSection(readme)
  await appendUOutsideOfCodingSection(readme)
  await appendFindMeSection(readme)
  console.log(`Done building README content.`)

  return readme
}

/**
 * Builds the README content and writes it to the output file.
 */
buildReadme().then((readme) => {
  console.log(`Writing README content to ${OUTPUT_FILE_PATH}...`)
  Bun.file(OUTPUT_FILE_PATH)
    .write(readme.join('\n'))
    .then(() => {
      console.log(`Wrote README content to ${OUTPUT_FILE_PATH}...`)
    })
})
