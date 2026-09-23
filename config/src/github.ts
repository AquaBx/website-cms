const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'
interface graphResponse<T> {
    "data": {
        "search": {
            "nodes": T[]
            "pageInfo": {
                hasNextPage: boolean,
                endCursor: string,
            }
        }
        viewer: {
            "repositories": {
                "nodes": T[]
                "pageInfo": {
                    hasNextPage: boolean,
                    endCursor: string,
                }
            }
        }
    }
}
export async function fetchMany<T>(
    query: string,
    initVariables: Record<string, any>,
    path: string[]
) {
    const token = process.env.GITHUB_TOKEN

    let hasNextPage = true
    let cursor = null

    let jsonResponses: T[] = []

    while (hasNextPage) {
        let variables = {
            ...initVariables,
            cursor
        }
        let body = JSON.stringify({
            query,
            variables
        })

        let options = {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            },
            body
        }
        const response = await fetch(GITHUB_GRAPHQL_URL, options)
        const jsonResponse: graphResponse<T> = await response.json()

        let data: any = jsonResponse.data
        for (let p of path) {
            data = data[p]
        }

        hasNextPage = data.pageInfo.hasNextPage
        cursor = data.pageInfo.endCursor
        jsonResponses = [...jsonResponses, ...data.nodes]
    }

    return jsonResponses
}

export async function fetchContributions() {
    let query = `
            query ($queryString: String!, $cursor: String) {
                search(query: $queryString, type: ISSUE, first: 100, after: $cursor) {
                    nodes { 
                        ... on PullRequest {
                            title
                            url
                            repository {
                                owner {
                                    avatarUrl
                                    login
                                }
                                id
                                url
                                name
                                stargazerCount
                            }
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        `
    let variables = {
        "queryString": "is:pr is:merged author:AquaBx -user:AquaBx  -org:AquaBxSchool -org:Cours-ESIR -org:BDE-ISATI -org:gauchedinternet",
    }

    let jsonResponses = await fetchMany<{
        "repository": {
            "id": string,
            "url": string,
            owner: {
                login: string
                avatarUrl: string
            }
            "name": string,
            "stargazerCount": number
        },
        "title": string,
        "url": string,
    }>(query, variables, ["search"])

    let contributions = new Map<string, {
        id: string
        url: string
        title: string
        stars: number
        owner: {
            login: string
            avatarUrl: string
        }
        pullRequests: {
            "title": string,
            "url": string,
        }[]
    }>()

    jsonResponses.forEach(({ title, url, repository }) => {

        if (!(repository.id in contributions)) {
            contributions.set(repository.id, {
                url: repository.url,
                id: repository.id,
                stars: repository.stargazerCount,
                title: repository.name,
                owner: repository.owner,
                pullRequests: []
            })
        }

        contributions.get(repository.id)!.pullRequests.push({
            title,
            url,
        })
    });
    return Array.from(contributions.values())
}

export async function fetchOwnedProjects() {
    let query = `
        query ($cursor: String) {
            viewer {
                repositories(first: 100, after: $cursor, 
                affiliations: [OWNER],
                orderBy: {field: UPDATED_AT, direction: DESC}) {
                    nodes {
                        owner {
                           avatarUrl
                            login
                        }
                        id
                        name
                        description
                        url
                        isPrivate
                        stargazerCount
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        }
    `

    let variables = {}
    let jsonResponses = await fetchMany<{
        id: string
        name: string
        description: string
        owner: {
            login: string
            avatarUrl: string
        },
        stargazerCount: number,
        url: string
        isPrivate: boolean
    }>(query, variables, ["viewer", "repositories"])

    return jsonResponses.map(({ id, name, owner, stargazerCount, url, isPrivate }) => {
        return {
            id,
            stars: stargazerCount,
            title: name,
            isPrivate,
            url: url,
            pullRequests: [],
            owner,
        }
    })
}

export async function fetchOwnedProjectsOrganisation() {
    let query = `
        query ($cursor: String) {
            viewer {
                repositories(first: 100, after: $cursor, 
                    affiliations: [COLLABORATOR, ORGANIZATION_MEMBER],
                orderBy: {field: UPDATED_AT, direction: DESC}) {
                    nodes {
                        owner {
                           avatarUrl
                            login
                        }
                        id
                        name
                        description
                        url
                        isPrivate
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        }
    `

    let variables = {}
    let jsonResponses = await fetchMany<{
        id: string
        name: string
        description: string
        owner: {
            login: string
            avatarUrl: string
        }
        stargazerCount: number
        url: string
        isPrivate: boolean
    }>(query, variables, ["viewer", "repositories"])

    return jsonResponses.map(({ id, name, owner, stargazerCount, description, url, isPrivate }) => {
        return {
            id,
            stars: stargazerCount,
            title: name,
            isPrivate,
            url: url,
            pullRequests: [],
            owner,
        }
    })
}