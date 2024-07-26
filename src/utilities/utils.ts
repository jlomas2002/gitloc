const codeFileTypes = [
	"c",
	"cpp",
	"cxx",
	"cc",
	"c++",
	"h",
	"hpp",
	"hxx",
	"hh",
	"java",
	"py",
	"js",
	"ts",
	"php",
	"html",
	"css",
	"rb",
	"swift",
	"go",
	"rs",
	"sh",
	"pl",
	"sql",
	"xml",
	"json",
	"md",
	"yaml",
	"yml",
	"bat",
	"cmd",
	"ps1",
	"tex",
	"asm"
];

export function isCodeFile(filePath: string): boolean {
	const [, fileType] = filePath.split('.');
	//return codeFileTypes.includes(fileType);
	return fileType == "cpp";
}

export function isRepoLink(repoLink: string): boolean {
	const regex = /^https:\/\/github\.com\/[a-zA-Z0-9\-\.]+\/[a-zA-Z0-9\-\.]+$/;
	return regex.test(repoLink);

}

export function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}