import { partial } from 'lodash';
import yamlFormatter from './yaml';
import tomlFormatter from './toml';
import jsonFormatter from './json';
import FrontmatterFormatter from './frontmatter';

export const supportedFormats = [
  'markdown',
  'yaml',
  'toml',
  'json',
  'html',
];

export const formatToExtension = format => ({
  markdown: 'md',
  yaml: 'yml',
  toml: 'toml',
  json: 'json',
  html: 'html',
}[format]);

export function formatByExtension(extension) {
  return {
    yml: yamlFormatter,
    yaml: yamlFormatter,
    toml: tomlFormatter,
    json: jsonFormatter,
    md: FrontmatterFormatter,
    markdown: FrontmatterFormatter,
    html: FrontmatterFormatter,
  }[extension] || FrontmatterFormatter;
}

function formatByName(name) {
  return {
    yml: yamlFormatter,
    yaml: yamlFormatter,
    toml: tomlFormatter,
    md: FrontmatterFormatter,
    markdown: FrontmatterFormatter,
    html: FrontmatterFormatter,
    frontmatter: FrontmatterFormatter,
  }[name];
}

export function resolveFormat(collectionOrEntity, entry) {
  const format = collectionOrEntity.get('format');
  const filePath = entry && entry.path;

  let formatter;
  if (format) {
    // If the format is specified in the collection, use that format.
    formatter = formatByName(format);
  } else if (filePath) {
    // If a file already exists, infer the format from its file extension.
    const fileExtension = filePath.split('.').pop();
    formatter = formatByExtension(fileExtension);
  }
  return {
    fromFile: partial(formatter.fromFile, collectionOrEntity),
    toFile: partial(formatter.toFile, collectionOrEntity),
  };
}
