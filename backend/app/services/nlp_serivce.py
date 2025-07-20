from nlp_processor import NLPProcessor

nlp_processors = {}

def initialize_nlp_processor(doc_id, full_text):
    nlp = NLPProcessor()
    success = nlp.process_document(full_text, str(doc_id))
    if success:
        nlp_processors[doc_id] = nlp
    return success

def get_or_load_nlp(doc_id, text_content=None):
    if doc_id in nlp_processors:
        return nlp_processors[doc_id]

    nlp = NLPProcessor()
    if nlp.load_existing_vectorstore(str(doc_id)):
        nlp_processors[doc_id] = nlp
    elif text_content:
        nlp.process_document(text_content, str(doc_id))
        nlp_processors[doc_id] = nlp
    return nlp_processors[doc_id]
