import { readFile, writeFile } from 'node:fs/promises'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { ModelManager } from '@glazed/devtools'

// The encoded model could be imported from the file system for example
const bytes = await readFile(new URL('deviceSchema.json', import.meta.url))
const encodedModel = JSON.parse(bytes.toString())
console.log(encodedModel)

const ceramic = new CeramicClient("http://localhost:7007")
console.log("ceramic: ", ceramic)

const manager = new ModelManager(ceramic)

await manager.createSchema('deviceSchema', {
	$schema: 'http://json-schema.org/draft-07/schema#',
	title: 'DeviceSchema',
	type: 'object',
	properties: {
		sensor: {
		type: "object",
		properties: {
			sensorOutput: {
			type: "array",
			properties: {
				name: {
				type: "string",
				maxLength: 150
				},
				value: {
				type: "number"
				}
			}
			},
			deviceName: {
			type: "string",
			maxLength: 150
			}
		}
		}
	},
	required: ['deviceName'],
	})
// const manager = ModelManager.fromJSON(ceramic, encodedModel)

// // The published model could then itself be exported to be used at runtime
// const publishedModel = await manager.toPublished()
// await writeFile(new URL('published-model.json', import.meta.url), JSON.stringify(publishedModel))


