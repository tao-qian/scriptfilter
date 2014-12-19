# Overview
The goal of this project is to build a browser plugin that filters malicious webpages based on the content statically. Most existing plugins either filter webpages based on the URL or disable all scripts on the webpage. The first approach is not very effective because a list of URLs for malicious webpages must be maintained. And the second approach often blocks more content than necessary. One example is the [NoScript Security Suite](https://noscript.net/) for Mozilla Firefox developed by Giorgio Maone. When using the recommended security settings, the NoScript plugin would prevent many safe websites from working properly.

Our plan is to train a machine learning model that classifies webpages by analyzing the content statically. The model would be trained on labeled data that contain both malicious and benign webpages to learn the features of malicious webpages.
This approach would have lower false negative rate than the URL matching approach, because the features learned by our model are less likely to change compared to the URLs of a webpage. On the other hand, it will have lower false positive rate than the NoScript approach, which basically assumes that all webpages are malicious.

# Classifier
The first stage of this project is to build a classifier that detects malicious webpages. 

## Past Work
Past work in this area include:
* P. Likarish, E.J. Jung, and I. Jo. Obfuscated Malicious Javascript Detection using Classification Techniques. In The 4th International Malicious and Unwanted Software (Malware 2009), October 2009.
* M. Cova, C. Kruegel, and G. Vigna. Detection and Analysis of Drive-by-Download Attacks and Malicious JavaScript Code. In Proceedings of the World Wide Web Conference (WWW), April 2010.
* D. Canali, M. Cova, G. Vigna, and C. Krugel. Prophiler: A fast filter for the large-scale detection of malicious webpages. In Proceedings of the International World Wide Web Conference, Mar. 2011.
* C. Curtsinger, B. Livshits, B. Zorn, and C. Seifert. Zozzle: Low-overhead Mostly Static JavaScript Malware Detection. In Proceedings of the Usenix Security Symposium, 2011.
* [Google's Safe Browsing API](https://developers.google.com/safe-browsing/)

## Training Data
We used webpages from [Alexa's top ranked websites](https://support.alexa.com/hc/en-us/articles/200449834-Does-Alexa-have-a-list-of-its-top-ranked-websites-) as negative training data.

We used webpages from [a list of manually curated malicious urls](http://someonewhocares.org/hosts/zero/) as the positive training data. Some of the URLs in the list lead to ad websites and shock pages, which are technically not malicious because there are no security concerns. Those URL are not used as positive training data, though in the future we may consider including them just to make the users' browsing experience more pleasant.

We also hash the downloaded webpages using MD5. By comparing the hashes, we are able to remove duplicate webpages with different URLs. This is especially necessary for the positive training data because almost half of the webpages are duplicates. One possible explanation is that the owner of the malicious sites often use multiple domains for the same site in case some of the domains are blocked by authorities. For future work, a locality sensitive hash function should be used to account for webpages that are only slightly different (e.g. with a different date).

## Features
So far we only used the features outlined in Prophiler: A Fast Filter for the Large-Scale Detection of Malicious Web Pages.

### HTML Features
* the number of iframe tags
* the number of elements with a small area: Records the number of elements of type div, iframe, or object, whose dimension is less then a certain threshold (30 square pixels for the area, or 2 pixels for each side)
* the number of script elements (both included via the src attribute, and inline)
* the presence of scripts with a wrong file name extension
* the percentage of scripting content in a page
* the percentage of whitespace in the page
* the presence of meta refresh tags
* the number of embed and object tags
* the number of elements whose source is on an external domain
* the number of included URLs: This feature counts the number of elements which, being not inline, are included specifying their source location. Elements such as script, iframe, frame, embed, form, object are considered in computing this feature, because they can be used to include external content in a web page. 
* the presence of double documents
* the number of characters in the page

### Javascript features
Javascript features requires the generation of [abstract syntax tree](http://en.wikipedia.org/wiki/Abstract_syntax_tree).

The Python library for doing this is [PyV8](https://code.google.com/p/pyv8/), which is based on the [Google V8 Engine](https://code.google.com/p/v8/).

For Javascript, use [Esprima](http://esprima.org/).

For Java, use [Rhino](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino).

## Training and Classfication
[Scikit](http://scikit-learn.org/stable/) was used.

# Browser Plugin
The second stage of the project is to integrate the classifier into a browser plugin. The current plan is to build a browser plugin for Mozilla Firefox. The plugin should be an XUL extension because this type of extension allows access to lower-level browser APIs. Specifically, the shouldProcess and shouldLoad method of the nsIContentPolicy interface should be overwritten to analyze page content and block malicious pages.
